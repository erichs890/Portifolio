import type { ReactNode } from "react";

/** SQL keyword inside a QueryHeading. */
export const Kw = ({ children }: { children: ReactNode }) => (
  <span className="font-medium text-accent-text">{children}</span>
);

interface QueryHeadingProps {
  sql: ReactNode;
  title: string;
  /** Real row count of the list under the heading; omit when the block is not a list. */
  rows?: number;
  children?: ReactNode;
}

/** Section heading written as the query that produces the content under it. */
export function QueryHeading({ sql, title, rows, children }: QueryHeadingProps) {
  return (
    <div className="mb-8">
      <p className="mb-2.5 font-mono text-[13px] text-muted break-words">{sql}</p>
      <h2>{title}</h2>
      {rows !== undefined && (
        <p className="mt-2 font-mono text-xs text-muted">
          ({rows} {rows === 1 ? "row" : "rows"})
        </p>
      )}
      {children}
    </div>
  );
}
