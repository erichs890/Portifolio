/**
 * Autocomplete for the hero terminal. Given what has been typed so far, it proposes what can come
 * next: tables after FROM, columns after SELECT or WHERE, values for known columns, and so on.
 * It only looks at the text before the caret, so it is cheap enough to run on every keystroke.
 */

/** Tables and columns of the in-browser copy. Keep in sync with SCHEMA in sqlPlayground.ts. */
export const PLAYGROUND_TABLES: Record<string, string[]> = {
  projects: ["id", "name", "slug", "status", "role", "featured", "created_at", "repository_url", "live_url"],
  technologies: ["id", "name"],
  project_technologies: ["project_id", "technology_id"],
};

const TABLE_NAMES = Object.keys(PLAYGROUND_TABLES);

/** Values worth offering after `column =`. */
const COLUMN_VALUES: Record<string, string[]> = {
  status: ["'IN_PRODUCTION'", "'FINISHED'", "'IN_DEVELOPMENT'"],
  role: ["'CREATOR'", "'CO_CREATOR'", "'COLLABORATOR'"],
  featured: ["1", "0"],
};

const AFTER_TABLE = ["WHERE", "JOIN", "GROUP BY", "ORDER BY", "LIMIT", ";"];
const OPERATORS = ["=", "LIKE", "IN", "IS NULL", "IS NOT NULL"];
const AFTER_CONDITION = ["AND", "OR", "GROUP BY", "ORDER BY", "LIMIT", ";"];
const KEYWORDS = new Set(["SELECT", "FROM", "WHERE", "JOIN", "ON", "AND", "OR", "BY", "LIMIT", "AS", "GROUP", "ORDER", "WITH"]);

export interface Completion {
  /** What the list shows. */
  label: string;
  /** The input after accepting this option. */
  result: string;
}

const unique = (items: string[]) => [...new Set(items)];

/** Tables named after FROM or JOIN in the text so far; all tables when none is named yet. */
function tablesInScope(text: string): string[] {
  const named = [...text.matchAll(/\b(?:from|join)\s+(\w+)/gi)].map((m) => m[1].toLowerCase());
  const known = named.filter((name) => name in PLAYGROUND_TABLES);
  return known.length > 0 ? unique(known) : TABLE_NAMES;
}

const columnsOf = (tables: string[]) => unique(tables.flatMap((table) => PLAYGROUND_TABLES[table]));

/** Options for the position right after `before`, ignoring any word being typed. */
function optionsAfter(before: string): string[] {
  const trimmed = before.trimEnd();
  if (trimmed === "") return ["SELECT", "\\dt", "\\d", "\\?"];
  if (/^\\d$/i.test(trimmed)) return TABLE_NAMES;
  if (trimmed.startsWith("\\")) return [];

  const words = trimmed.split(/\s+/);
  const last = words[words.length - 1];
  const lastUpper = last.toUpperCase();
  const previousUpper = (words[words.length - 2] ?? "").toUpperCase();
  const endsWithComma = trimmed.endsWith(",");
  const hasFrom = /\bfrom\b/i.test(trimmed);
  const scope = tablesInScope(trimmed);

  if (lastUpper === "FROM" || lastUpper === "JOIN") return TABLE_NAMES;

  if (lastUpper === "SELECT") {
    // Nobody knows the tables up front, so whole starts come first, then single columns.
    return [...TABLE_NAMES.map((table) => `* FROM ${table}`), "COUNT(*) FROM projects", ...columnsOf(TABLE_NAMES)];
  }

  // Still listing columns: another column after a comma, FROM after a column.
  if (!hasFrom) return endsWithComma ? ["COUNT(*)", ...columnsOf(TABLE_NAMES)] : ["FROM", ","];

  if (["WHERE", "AND", "OR", "ON", "BY"].includes(lastUpper) || endsWithComma) return columnsOf(scope);

  if (last === "=" || lastUpper === "LIKE") {
    const column = (words[words.length - 2] ?? "").toLowerCase().split(".").pop() ?? "";
    return COLUMN_VALUES[column] ?? [];
  }

  // A table name was just written.
  if ((previousUpper === "FROM" || previousUpper === "JOIN") && last.toLowerCase() in PLAYGROUND_TABLES) {
    return previousUpper === "JOIN" ? ["ON", ...AFTER_TABLE] : AFTER_TABLE;
  }

  // A column was just written inside a condition.
  if (["WHERE", "AND", "OR", "ON"].includes(previousUpper)) return OPERATORS;

  // Anywhere else: continue the condition if there is one, otherwise the clauses that can follow a table.
  return /\bwhere\b/i.test(trimmed) ? AFTER_CONDITION : AFTER_TABLE;
}

const MAX_OPTIONS = 8;

/** Completions for the text before the caret. Empty when there is nothing sensible to offer. */
export function completeSql(text: string): Completion[] {
  const partial = text.match(/[\w.*\\']*$/)?.[0] ?? "";
  let before = text.slice(0, text.length - partial.length);
  let word = partial;

  // A finished word counts as typed: "select" offers what follows SELECT, and "from projects"
  // offers what follows the table, instead of repeating the word itself.
  const finished =
    word !== "" &&
    (KEYWORDS.has(word.toUpperCase()) ||
      /^\\d$/i.test(word) ||
      optionsAfter(before).some((option) => option.toLowerCase() === word.toLowerCase()));
  if (finished) {
    before = `${text} `;
    word = "";
  }

  const needle = word.toLowerCase();
  return optionsAfter(before)
    .filter((option) => option.toLowerCase().startsWith(needle) && option.toLowerCase() !== needle)
    .slice(0, MAX_OPTIONS)
    .map((option) => {
      const joined = before.length > 0 && !/\s$/.test(before) && option !== ";" && option !== "," ? `${before} ` : before;
      return { label: option, result: option === ";" ? `${joined.trimEnd()};` : `${joined}${option} ` };
    });
}
