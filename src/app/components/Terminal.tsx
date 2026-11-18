"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { completeSql } from "@/lib/sqlComplete";
import {
  createPlaygroundDb,
  formatTable,
  type PlaygroundDb,
  type PlaygroundProject,
} from "@/lib/sqlPlayground";

export type TerminalProject = PlaygroundProject;

type Tone = "plain" | "muted" | "error";
interface OutLine {
  text: string;
  tone: Tone;
}
interface Entry {
  sql: string;
  out: OutLine[];
}
interface Preset extends Entry {
  id: string;
  tab: string;
}

/** One pass over a command: string literals, numbers and SQL keywords each get their own colour. */
const TOKENS =
  /('(?:[^']|'')*'?)|(\b\d+(?:\.\d+)?\b)|(\b(?:SELECT|FROM|WHERE|GROUP|ORDER|BY|HAVING|DISTINCT|COUNT|SUM|AVG|MIN|MAX|DESC|ASC|LIMIT|OFFSET|JOIN|LEFT|INNER|OUTER|CROSS|ON|AS|AND|OR|NOT|IN|LIKE|IS|NULL|BETWEEN|CASE|WHEN|THEN|ELSE|END|WITH|UNION|ALL|EXISTS|INSERT|INTO|VALUES|UPDATE|SET|DELETE|CREATE|DROP|ALTER|TABLE)\b)/gi;

/** Only projections are accepted: a single SELECT (optionally introduced by WITH). */
const READ_ONLY = /^\s*(select|with)\b/i;
const hasSecondStatement = (sql: string) =>
  sql
    .replace(/'(?:[^']|'')*'/g, "")
    .replace(/;\s*$/, "")
    .includes(";");

const PROMPT = "portfolio_db=> ";
const TYPE_MS = 12;
const ROW_MS = 60;
const MAX_INPUT = 2000;

const toneClass: Record<Tone, string> = {
  plain: "text-[var(--term-text)]",
  muted: "text-[var(--term-muted)]",
  error: "text-[#ff8a8a]",
};

const plain = (lines: string[]): OutLine[] => lines.map((text) => ({ text, tone: "plain" }));
const muted = (lines: string[]): OutLine[] => lines.map((text) => ({ text, tone: "muted" }));

function countBy(values: string[]): [string, number][] {
  const counts = new Map<string, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1));
}

/** A command with SQL syntax colours. Plain text keeps the command colour of its parent. */
function Sql({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(TOKENS)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push(text.slice(last, index));
    const tone = match[1] ? "text-[var(--term-str)]" : match[2] ? "text-[var(--term-num)]" : "text-[var(--term-key)] font-medium";
    nodes.push(
      <span key={index} className={tone}>
        {match[0]}
      </span>
    );
    last = index + match[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}

function Output({ lines }: { lines: OutLine[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <div key={i} className={toneClass[line.tone]}>
          {line.text || " "}
        </div>
      ))}
    </>
  );
}

export function Terminal({ projects }: { projects: TerminalProject[] | null }) {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [showPreset, setShowPreset] = useState(true);
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);
  const [log, setLog] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyAt, setHistoryAt] = useState(-1);
  const [picked, setPicked] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [caretAtEnd, setCaretAtEnd] = useState(true);

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dbRef = useRef<PlaygroundDb | null>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  /** Keeps the coloured mirror aligned with the input when a long command scrolls sideways. */
  const syncMirror = () => {
    const field = inputRef.current;
    if (!field) return;
    if (mirrorRef.current) mirrorRef.current.scrollLeft = field.scrollLeft;
    setCaretAtEnd(field.selectionStart === field.value.length && field.selectionEnd === field.value.length);
  };

  const helpLines = useMemo(
    () => muted([t("termHelp1"), t("termHelp2"), "", t("termHelp3"), t("termHelp4"), "", t("termHelp5")]),
    [t]
  );

  // The tabs print exactly what the playground would return for the same SQL,
  // computed in plain JS so the SQL engine is only downloaded if someone types.
  const presets = useMemo<Preset[]>(() => {
    const unavailable: OutLine[] = [
      { text: "error: connection to server failed", tone: "error" },
      { text: t("termError"), tone: "muted" },
    ];
    const run = (build: (rows: TerminalProject[]) => string[]) => (projects ? plain(build(projects)) : unavailable);

    return [
      {
        id: "status",
        tab: "status",
        sql: "SELECT status, COUNT(*) AS count FROM projects\nGROUP BY status ORDER BY 2 DESC, 1;",
        out: run((rows) => formatTable(["status", "count"], countBy(rows.map((p) => p.status)))),
      },
      {
        id: "stack",
        tab: "stack",
        sql: "SELECT t.name AS stack, COUNT(*) AS count\nFROM technologies t\nJOIN project_technologies pt ON pt.technology_id = t.id\nGROUP BY t.name ORDER BY 2 DESC, 1 LIMIT 6;",
        out: run((rows) =>
          formatTable(["stack", "count"], countBy(rows.flatMap((p) => [...new Set(p.stack)])).slice(0, 6))
        ),
      },
      {
        id: "prod",
        tab: t("termTabProd"),
        sql: "SELECT name FROM projects\nWHERE status = 'IN_PRODUCTION';",
        out: run((rows) =>
          formatTable(
            ["name"],
            rows.filter((p) => p.status === "IN_PRODUCTION").map((p) => [p.name])
          )
        ),
      },
      { id: "help", tab: "help", sql: "\\?", out: helpLines },
    ];
  }, [projects, t, helpLines]);

  const preset = presets[active];

  // Type the preset query, then reveal its result line by line. Instant under reduced motion.
  useEffect(() => {
    const total = preset.sql.length;
    const rows = preset.out.length;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTyped(total);
      setShown(rows);
      return;
    }
    setTyped(0);
    setShown(0);
    let chars = 0;
    let lines = 0;
    let timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (chars < total) {
        chars += 1;
        setTyped(chars);
        timer = setTimeout(step, TYPE_MS);
      } else if (lines < rows) {
        lines += 1;
        setShown(lines);
        timer = setTimeout(step, ROW_MS);
      }
    };
    timer = setTimeout(step, 250);
    return () => clearTimeout(timer);
  }, [preset]);

  // Keep the newest output in view.
  useEffect(() => {
    const panel = panelRef.current;
    if (panel && log.length > 0) panel.scrollTop = panel.scrollHeight;
  }, [log, busy]);

  useEffect(() => () => dbRef.current?.close(), []);

  const presetDone = typed >= preset.sql.length && shown >= preset.out.length;

  const selectTab = (index: number) => {
    setActive(index);
    setShowPreset(true);
    setLog([]);
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + presets.length) % presets.length;
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  /** Runs one command against the in-browser copy and returns what to print. */
  const execute = async (command: string): Promise<OutLine[]> => {
    if (command === "\\?" || /^help;?$/i.test(command)) return helpLines;

    if (!projects) {
      return [{ text: t("termError"), tone: "error" }];
    }
    if (/^\\reset;?$/i.test(command)) {
      dbRef.current?.close();
      dbRef.current = null;
      return muted([t("termReset")]);
    }

    let sql = command;
    if (/^\\dt;?$/i.test(command)) {
      sql = "SELECT name AS \"table\" FROM sqlite_master WHERE type = 'table' ORDER BY 1";
    } else {
      const describe = command.match(/^\\d\s+(\w+);?$/i);
      if (describe) sql = `SELECT name AS "column", type FROM pragma_table_info('${describe[1]}')`;
      else if (command.startsWith("\\")) return [{ text: `${t("termUnknown")} ${command}`, tone: "error" }];
    }

    if (!READ_ONLY.test(sql)) return [{ text: t("termReadOnly"), tone: "error" }];
    if (hasSecondStatement(sql)) return [{ text: t("termOneQuery"), tone: "error" }];

    try {
      dbRef.current ??= await createPlaygroundDb(projects);
      const db = dbRef.current;
      const results = db.exec(sql);
      if (results.length === 0) return plain(["OK"]);
      return plain(results.flatMap((result) => formatTable(result.columns, result.values)));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // The engine is in query-only mode; say so plainly if something slips past the check above.
      if (/readonly|read-only|query_only/i.test(message)) return [{ text: t("termReadOnly"), tone: "error" }];
      const lines: OutLine[] = [{ text: `ERROR: ${message}`, tone: "error" }];
      // A syntax error usually means plain words were typed, so point at a query that works.
      if (/syntax error|incomplete input/i.test(message)) lines.push({ text: t("termErrorHint"), tone: "muted" });
      return lines;
    }
  };

  const runCommand = async (raw: string) => {
    const command = raw.trim();
    if (!command || busy) return;
    setInput("");
    setHistory((past) => [...past.filter((item) => item !== command), command]);
    setHistoryAt(-1);

    if (/^(clear|cls|\\c);?$/i.test(command)) {
      setShowPreset(false);
      setLog([]);
      return;
    }
    setBusy(true);
    const out = await execute(command);
    setLog((entries) => [...entries, { sql: command, out }]);
    setBusy(false);
    inputRef.current?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void runCommand(input);
  };

  // Inline autocomplete, shown as grey text after the caret. Only while the caret sits at the end,
  // so accepting never rewrites the middle of a command.
  // Nothing is suggested on an empty prompt: the placeholder is the hint there.
  const options = useMemo(
    () => (input.trim() !== "" && caretAtEnd && !dismissed ? completeSql(input) : []),
    [input, caretAtEnd, dismissed]
  );
  const selected = Math.min(picked, Math.max(options.length - 1, 0));
  const ghost = (() => {
    const option = options[selected];
    if (!option || !option.result.toLowerCase().startsWith(input.toLowerCase())) return "";
    const rest = option.result.slice(input.length).trimEnd();
    // Finishing a word typed in lowercase: show the rest of that word in lowercase too ("sel" + "ect").
    if (!/[a-z]$/.test(input)) return rest;
    const wordEnd = rest.search(/\s|$/);
    return rest.slice(0, wordEnd).toLowerCase() + rest.slice(wordEnd);
  })();

  const accept = (index: number) => {
    const option = options[index];
    if (!option) return;
    setInput(option.result);
    setPicked(0);
    inputRef.current?.focus();
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (options.length > 0) {
      // Tab (or Right Arrow at the end of the line) takes the grey suggestion, as in a code editor.
      if ((e.key === "Tab" && !e.shiftKey) || (e.key === "ArrowRight" && ghost !== "")) {
        e.preventDefault();
        accept(selected);
        return;
      }
      if (e.key === "Escape") {
        setDismissed(true);
        return;
      }
      // Up and Down switch to the other suggestions for this position.
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const step = e.key === "ArrowDown" ? 1 : -1;
        setPicked((selected + step + options.length) % options.length);
        return;
      }
    }
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    if (history.length === 0) return;
    e.preventDefault();
    const last = history.length - 1;
    const next =
      e.key === "ArrowUp" ? (historyAt === -1 ? last : Math.max(0, historyAt - 1)) : historyAt === -1 ? -1 : historyAt + 1;
    if (next === -1 || next > last) {
      setHistoryAt(-1);
      setInput("");
    } else {
      setHistoryAt(next);
      setInput(history[next]);
    }
  };

  const lastOutput = log.length > 0 ? log[log.length - 1] : showPreset && presetDone ? preset : null;

  return (
    <section
      aria-label={t("termRegion")}
      className="rounded-[14px] overflow-hidden border border-[var(--term-line)] bg-[var(--term-bg)] font-mono text-[13px] leading-[1.7] text-[var(--term-text)] shadow-[var(--shadow-lg),0_0_80px_-30px_var(--accent-glow)]"
    >
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-[var(--term-bar)] border-b border-[var(--term-line)] text-xs text-[var(--term-muted)]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a4257]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a4257]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a4257]" />
        <span className="ml-1 truncate">portfolio_db — sql · {t("termLocalCopy")}</span>
      </div>

      <div
        role="tablist"
        aria-label={t("termQueries")}
        className="flex gap-1 px-2.5 py-2 border-b border-[var(--term-line)] overflow-x-auto"
      >
        {presets.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`term-tab-${item.id}`}
              aria-selected={selected}
              aria-controls="term-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(i)}
              onKeyDown={onTabKey}
              className={`min-h-11 px-3 rounded-lg border text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                selected
                  ? "text-[var(--term-key)] border-[color-mix(in_srgb,var(--term-key)_30%,transparent)] bg-[color-mix(in_srgb,var(--term-key)_9%,transparent)]"
                  : "text-[var(--term-muted)] border-transparent hover:text-[var(--term-text)]"
              }`}
            >
              {item.tab}
            </button>
          );
        })}
      </div>

      <div
        ref={panelRef}
        role="tabpanel"
        id="term-panel"
        aria-labelledby={`term-tab-${preset.id}`}
        onClick={(e) => {
          // Clicking empty terminal space focuses the prompt, unless text is being selected.
          if (e.target === e.currentTarget || !window.getSelection()?.toString()) inputRef.current?.focus();
        }}
        className="h-[21rem] px-4 py-4 overflow-auto cursor-text"
      >
        {/* Screen readers get each finished result once (below), not every typed character. */}
        <div aria-hidden="true" className="whitespace-pre w-max min-w-full">
          {showPreset && (
            <div className="mb-[1.7em]">
              <div>
                <span className="text-[var(--term-muted)]">{PROMPT}</span>
                <span className="text-[var(--term-cmd)]">
                  <Sql text={preset.sql.slice(0, typed)} />
                </span>
                {typed < preset.sql.length && <Cursor />}
              </div>
              <div className="mt-[0.85em]">
                <Output lines={preset.out.slice(0, shown)} />
              </div>
            </div>
          )}
          {log.map((entry, i) => (
            <div key={i} className="mb-[1.7em]">
              <div>
                <span className="text-[var(--term-muted)]">{PROMPT}</span>
                <span className="text-[var(--term-cmd)]">
                  <Sql text={entry.sql} />
                </span>
              </div>
              <div className="mt-[0.85em]">
                <Output lines={entry.out} />
              </div>
            </div>
          ))}
          {busy && <div className="text-[var(--term-muted)]">{t("termLoading")}</div>}
        </div>

        <form onSubmit={onSubmit} className="flex items-center min-h-11 -my-2">
          <label htmlFor="term-input" className="text-[var(--term-muted)] whitespace-pre">
            <span aria-hidden="true">{PROMPT}</span>
            <span className="sr-only">{t("termInputLabel")}</span>
          </label>
          <div className="relative flex-1 min-w-0">
            <div
              ref={mirrorRef}
              aria-hidden="true"
              className="absolute inset-0 flex items-center overflow-hidden whitespace-pre pointer-events-none text-base md:text-[13px] text-[var(--term-cmd)]"
            >
              <span>
                <Sql text={input} />
                <span className="text-[var(--term-muted)] opacity-70">{ghost}</span>
              </span>
            </div>
            <input
              ref={inputRef}
              id="term-input"
              value={input}
              onChange={(e) => {
                setInput(e.target.value.slice(0, MAX_INPUT));
                setPicked(0);
                setDismissed(false);
              }}
              aria-describedby="term-hint"
              onKeyDown={onInputKey}
              onKeyUp={syncMirror}
              onScroll={syncMirror}
              onSelect={syncMirror}
              placeholder={t("termPlaceholder")}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              className="relative w-full min-h-11 bg-transparent text-base md:text-[13px] text-transparent caret-[var(--term-key)] placeholder:text-[var(--term-muted)] placeholder:opacity-70 rounded-sm"
            />
          </div>
        </form>

        <p id="term-hint" className="sr-only">
          {t("termSuggest")}
        </p>

        <div className="sr-only" aria-live="polite">
          {lastOutput && `${lastOutput.sql} ${lastOutput.out.map((line) => line.text.trim()).filter(Boolean).join(". ")}`}
        </div>
      </div>
    </section>
  );
}

function Cursor() {
  return <span className="inline-block w-2 h-[1.1em] align-text-bottom bg-[var(--term-key)] animate-blink" />;
}
