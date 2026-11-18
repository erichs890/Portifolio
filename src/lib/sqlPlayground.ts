/**
 * SQL playground for the hero terminal.
 *
 * Runs SQLite (sql.js 1.16.0, vendored in /public/sqljs) inside the visitor's browser, loaded with a
 * copy of the published projects. The terminal accepts SELECT queries only, and nothing typed here reaches the real database: the copy lives in
 * memory and is rebuilt from the snapshot on reset or page reload.
 */

/** One published project, as snapshotted by the server for the hero. */
export interface PlaygroundProject {
  name: string;
  slug: string;
  status: string;
  role: string;
  featured: boolean;
  /** ISO date (YYYY-MM-DD). */
  createdAt: string;
  repositoryUrl: string | null;
  liveUrl: string | null;
  stack: string[];
}

type SqlValue = string | number | null | Uint8Array;

export interface QueryResult {
  columns: string[];
  values: SqlValue[][];
}

export interface PlaygroundDb {
  exec(sql: string): QueryResult[];
  run(sql: string, params?: SqlValue[]): void;
  getRowsModified(): number;
  close(): void;
}

interface SqlJsStatic {
  Database: new () => PlaygroundDb;
}

declare global {
  interface Window {
    initSqlJs?: (config: { locateFile: (file: string) => string }) => Promise<SqlJsStatic>;
  }
}

/** Autocomplete reads the same tables and columns from PLAYGROUND_TABLES in sqlComplete.ts. */
const SCHEMA = `
CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  role TEXT NOT NULL,
  featured INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  repository_url TEXT,
  live_url TEXT
);
CREATE TABLE technologies (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);
CREATE TABLE project_technologies (
  project_id INTEGER NOT NULL REFERENCES projects(id),
  technology_id INTEGER NOT NULL REFERENCES technologies(id),
  PRIMARY KEY (project_id, technology_id)
);`;

let enginePromise: Promise<SqlJsStatic> | null = null;

/** Downloads the engine on first use only (about 0.7 MB of WebAssembly). */
function loadEngine(): Promise<SqlJsStatic> {
  enginePromise ??= new Promise<SqlJsStatic>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "/sqljs/sql-wasm.js";
    script.async = true;
    script.onload = () => {
      if (!window.initSqlJs) return reject(new Error("SQL engine failed to initialise"));
      window.initSqlJs({ locateFile: (file) => `/sqljs/${file}` }).then(resolve, reject);
    };
    script.onerror = () => reject(new Error("SQL engine failed to load"));
    document.head.appendChild(script);
  }).catch((error) => {
    enginePromise = null; // allow a retry on the next command
    throw error;
  });
  return enginePromise;
}

/** Builds a fresh in-memory copy of the project data. */
export async function createPlaygroundDb(projects: PlaygroundProject[]): Promise<PlaygroundDb> {
  const SQL = await loadEngine();
  const db = new SQL.Database();
  db.run(SCHEMA);

  const techIds = new Map<string, number>();
  projects.forEach((project, index) => {
    const projectId = index + 1;
    db.run("INSERT INTO projects VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
      projectId,
      project.name,
      project.slug,
      project.status,
      project.role,
      project.featured ? 1 : 0,
      project.createdAt,
      project.repositoryUrl,
      project.liveUrl,
    ]);
    for (const tech of new Set(project.stack)) {
      let techId = techIds.get(tech);
      if (techId === undefined) {
        techId = techIds.size + 1;
        techIds.set(tech, techId);
        db.run("INSERT INTO technologies VALUES (?, ?)", [techId, tech]);
      }
      db.run("INSERT INTO project_technologies VALUES (?, ?)", [projectId, techId]);
    }
  });
  // From here on the engine itself refuses anything that would change the copy.
  db.run("PRAGMA query_only = ON");
  return db;
}

const MAX_CELL = 44;
const MAX_ROWS = 60;

function cellText(value: SqlValue): string {
  if (value === null) return "";
  if (value instanceof Uint8Array) return "<blob>";
  const text = String(value).replace(/\s+/g, " ");
  return text.length > MAX_CELL ? `${text.slice(0, MAX_CELL - 1)}…` : text;
}

/** Formats a result set the way psql prints it. Numbers are right-aligned. */
export function formatTable(columns: string[], rows: SqlValue[][]): string[] {
  const visible = rows.slice(0, MAX_ROWS);
  const cells = visible.map((row) => row.map(cellText));
  const numeric = columns.map((_, c) => visible.length > 0 && visible.every((row) => typeof row[c] === "number"));
  const widths = columns.map((name, c) => Math.max(name.length, ...cells.map((row) => row[c].length)));
  const pad = (text: string, c: number) => (numeric[c] ? text.padStart(widths[c]) : text.padEnd(widths[c]));

  const lines = [
    ` ${columns.map((name, c) => name.padEnd(widths[c])).join(" | ")}`,
    widths.map((w) => "-".repeat(w + 2)).join("+"),
    ...cells.map((row) => ` ${row.map(pad).join(" | ")}`),
  ];
  const count = `(${rows.length} ${rows.length === 1 ? "row" : "rows"})`;
  lines.push(rows.length > MAX_ROWS ? `${count} — showing the first ${MAX_ROWS}` : count);
  return lines;
}
