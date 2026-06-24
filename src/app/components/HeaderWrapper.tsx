"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function HeaderWrapper() {
  const { lang, toggleLang, t } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAbout = pathname === "/about";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-950/70 backdrop-blur-xl border-b border-white/5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* scroll progress */}
      <motion.div
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 right-0 h-px origin-left bg-gradient-to-r from-accent-cyan via-accent-teal to-accent-emerald"
      />

      <nav className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link
          href="/"
          className="font-mono font-bold text-lg text-accent-cyan hover:no-underline transition-opacity hover:opacity-80"
        >
          <span className="text-text-muted">{"<"}</span>
          Erich
          <span className="text-text-muted">{" />"}</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#projects"
            className="hidden sm:inline-flex btn-ghost hover:no-underline"
          >
            .{t("navProjects").toLowerCase()}()
          </Link>

          <Link
            href="/about"
            className={`btn-ghost hover:no-underline ${isAbout ? "!text-accent-cyan" : ""}`}
          >
            .{t("navAbout").toLowerCase()}()
          </Link>

          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono text-text-secondary border border-white/5 bg-navy-800/40 hover:text-accent-cyan hover:border-white/15 transition-colors cursor-pointer"
            title={lang === "en" ? "Traduzir para Português" : "Translate to English"}
            aria-label={lang === "en" ? "Switch to Portuguese" : "Switch to English"}
          >
            <Globe size={14} />
            <span>{lang === "en" ? "PT" : "EN"}</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
