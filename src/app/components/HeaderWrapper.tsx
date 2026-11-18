"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { SITE } from "@/lib/site";

type SectionId = "projects" | "data" | "stack" | "about" | "contact";

const NAV: { id: SectionId; href: string; label: TranslationKey }[] = [
  { id: "projects", href: "/#projects", label: "navProjects" },
  { id: "data", href: "/#data", label: "navData" },
  { id: "stack", href: "/#stack", label: "navStack" },
  { id: "about", href: "/about", label: "navAbout" },
  { id: "contact", href: "/#contact", label: "navContact" },
];

/** Sections on the home page whose visibility drives the active nav item. */
const HOME_SECTIONS: SectionId[] = ["projects", "data", "stack", "contact"];

const controlClass =
  "grid place-items-center h-11 min-w-11 px-3 rounded-[10px] border border-line bg-surface-1 text-body font-mono text-[13px] font-medium hover:border-line-strong hover:text-heading transition-colors cursor-pointer";

export function HeaderWrapper() {
  const { lang, toggleLang, t } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visibleSection, setVisibleSection] = useState<SectionId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";
  const active: SectionId | null = pathname === "/about" ? "about" : isHome ? visibleSection : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section = the one crossing the middle band of the viewport.
  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id as SectionId;
          if (entry.isIntersecting) setVisibleSection(id);
          else setVisibleSection((current) => (current === id ? null : current));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    HOME_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  // Mobile sheet: lock page scroll and close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        solid ? "bg-bg/80 backdrop-blur-xl border-line" : "bg-transparent border-transparent"
      }`}
    >
      <nav aria-label={t("navMain")} className="container flex items-center gap-2 h-16">
        <Link
          href="/"
          className="mr-auto flex items-center min-h-11 font-mono font-semibold text-[17px] text-heading hover:no-underline"
        >
          {"<"}
          <span className="text-accent-text">Erich</span>
          {" />"}
        </Link>

        <ul className="hidden md:flex items-center">
          {NAV.map((item) => {
            const isActive = active === item.id;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  aria-current={isActive ? (item.id === "about" ? "page" : "location") : undefined}
                  className={`relative flex items-center min-h-11 px-3 rounded-lg text-sm font-medium hover:no-underline transition-colors ${
                    isActive ? "text-heading" : "text-muted hover:text-heading"
                  }`}
                >
                  {t(item.label)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-3 right-3 bottom-1.5 h-0.5 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <button type="button" onClick={toggleLang}  title={t("langSwitch")} className={controlClass}>
          {lang === "en" ? "PT" : "EN"}
          <span className="sr-only">, {t("langSwitch")}</span>
        </button>
        <ThemeToggle />

        {SITE.cvUrl && (
          <a href={SITE.cvUrl} download className="btn-primary !px-4 !text-sm hover:no-underline hidden sm:inline-flex">
            <FileText size={15} aria-hidden="true" />
            {t("navResume")}
          </a>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={t(menuOpen ? "navMenuClose" : "navMenuOpen")}
          className={`${controlClass} md:hidden`}
        >
          {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </nav>

    </header>

      {/* Outside <header>: its backdrop-filter would otherwise trap this fixed sheet. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-bg border-t border-line overflow-y-auto"
          >
            <ul className="container py-4">
              {NAV.map((item) => (
                <li key={item.id} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active === item.id ? "location" : undefined}
                    className={`flex items-center min-h-14 font-display text-2xl font-bold hover:no-underline ${
                      active === item.id ? "text-accent-text" : "text-heading"
                    }`}
                  >
                    {t(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
            {SITE.cvUrl && (
              <div className="container pb-8">
                <a href={SITE.cvUrl} download className="btn-primary w-full justify-center hover:no-underline">
                  <FileText size={15} aria-hidden="true" />
                  {t("navResume")}
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
