"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Globe } from "lucide-react";

export function HeaderWrapper() {
  const { lang, toggleLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-navy-900/85 backdrop-blur-xl border-b border-navy-700/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link
          href="/"
          className="font-mono font-bold text-lg text-accent-cyan hover:no-underline hover:opacity-80 transition-opacity"
        >
          {"<"}Erich{" />"}
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/about"
            className="text-text-secondary hover:text-accent-cyan text-sm font-mono transition-colors hover:no-underline"
          >
            .{t("navAbout").toLowerCase()}()
          </Link>

          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-text-secondary hover:text-accent-cyan text-sm font-mono transition-colors cursor-pointer"
            title={lang === "en" ? "Traduzir para Português" : "Translate to English"}
          >
            <Globe size={14} />
            <span>{lang === "en" ? "PT" : "EN"}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
