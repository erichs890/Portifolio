"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type Theme = "dark" | "light";

const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Storage can be blocked; the choice then lasts for this page only.
  }
  listeners.forEach((notify) => notify());
}

/** Dark by default; the visitor's choice is saved and restored before first paint (see layout.tsx). */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => "dark");
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      aria-label={t(next === "light" ? "themeToLight" : "themeToDark")}
      title={t(next === "light" ? "themeToLight" : "themeToDark")}
      className={`grid place-items-center w-11 h-11 rounded-[10px] border border-line bg-surface-1 text-body hover:border-line-strong hover:text-heading transition-colors cursor-pointer ${className}`}
    >
      {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}
