"use client";

import { useState } from "react";

export interface BarRow {
  key: string;
  label: string;
  value: number;
  /** Shown when the bar is hovered, focused or tapped. */
  detail: string;
}

interface BarChartProps {
  rows: BarRow[];
  /** Line shown under the chart before any bar is active. */
  hint: string;
  /** When set, bars act as buttons (Enter/click). */
  onSelect?: (key: string) => void;
}

/**
 * Horizontal bars, one series. Every value is printed at the tip, so nothing depends on hover;
 * hovering, focusing or tapping a bar adds the list of projects behind it.
 */
export function BarChart({ rows, hint, onSelect }: BarChartProps) {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(...rows.map((row) => row.value), 1);
  const current = rows.find((row) => row.key === active);

  return (
    <div>
      <ul className="grid gap-1" onMouseLeave={() => setActive(null)}>
        {rows.map((row) => {
          const isActive = row.key === active;
          const body = (
            <>
              <span className="truncate text-sm text-body text-left">{row.label}</span>
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className={`h-4 rounded-r-[4px] bg-chart-bar transition-[filter,opacity] duration-150 ${
                    active && !isActive ? "opacity-45" : ""
                  }`}
                  style={{ width: `${(row.value / max) * 100}%`, minWidth: 4 }}
                />
                <span className="font-mono text-sm font-medium text-heading tabular-nums">{row.value}</span>
              </span>
              {/* The visible text stays the accessible name; the project list is added for screen readers. */}
              <span className="sr-only">{row.detail}</span>
            </>
          );
          const rowClass = `grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] items-center gap-3 w-full min-h-11 px-2 -mx-2 rounded-lg ${
            isActive ? "bg-surface-2" : ""
          }`;
          return (
            <li key={row.key} onMouseEnter={() => setActive(row.key)}>
              {onSelect ? (
                <button
                  type="button"
                  onClick={() => onSelect(row.key)}
                  onFocus={() => setActive(row.key)}
                  onBlur={() => setActive(null)}
                  className={`${rowClass} cursor-pointer`}
                >
                  {body}
                </button>
              ) : (
                <div
                  tabIndex={0}
                  onFocus={() => setActive(row.key)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(row.key)}
                  className={rowClass}
                >
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p aria-hidden="true" className="mt-4 pt-3 min-h-[4.25rem] border-t border-line text-sm text-muted">
        {current ? (
          <>
            <strong className="font-semibold text-heading">{current.label}</strong> · {current.detail}
          </>
        ) : (
          hint
        )}
      </p>
    </div>
  );
}
