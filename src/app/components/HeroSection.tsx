"use client";

import dynamic from "next/dynamic";
import { ArrowDown, MessageCircle } from "lucide-react";
import { AnimatedCounter } from "@/components";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import type { TerminalProject } from "./Terminal";

/* The terminal is interactive-only, so it loads after the hero text; the placeholder holds its space. */
const Terminal = dynamic(() => import("./Terminal").then((m) => m.Terminal), {
  ssr: false,
  loading: () => (
    <div className="h-[27.5rem] rounded-[14px] border border-[var(--term-line)] bg-[var(--term-bg)]" />
  ),
});

/* Entrance is CSS-only so the name (the largest paint) is visible before any script runs. */
const rise = (delay: number) => ({
  style: { animationDelay: `${delay}s` },
});
const RISE = "animate-fade-in-up";

const iconLinkClass =
  "grid place-items-center w-11 h-11 rounded-[10px] border border-line bg-surface-1 text-body hover:border-line-strong hover:text-heading transition-colors";

export function HeroSection({ projects }: { projects: TerminalProject[] | null }) {
  const { t } = useI18n();

  const stats = projects && [
    { label: t("statProjects"), value: projects.length },
    { label: t("statInProd"), value: projects.filter((p) => p.status === "IN_PRODUCTION").length },
    { label: t("statFinished"), value: projects.filter((p) => p.status === "FINISHED").length },
  ];

  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24">
      <div className="container grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-10 lg:gap-14 items-center">
        <div>
          <p {...rise(0.05)} className={`${RISE} mb-4 font-mono text-[15px] font-semibold text-heading`}>
            {t("heroRole")}
          </p>

          <h1>
            Erich Lima <span className="text-accent-text">Schlaepfer.</span>
          </h1>

          <p {...rise(0.18)} className={`${RISE} mt-6 max-w-[54ch] text-[clamp(1rem,1.3vw,1.15rem)] text-body`}>
            {t("heroDescription")}
          </p>

          <p {...rise(0.22)} className={`${RISE} mt-4 font-mono text-[13px] text-muted`}>
            {t("heroProof")}
          </p>

          <div {...rise(0.28)} className={`${RISE} mt-8 flex flex-wrap items-center gap-3`}>
            <a href="#projects" className="btn-primary hover:no-underline group">
              {t("heroCta")}
              <ArrowDown size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
            <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-secondary hover:no-underline">
              <MessageCircle size={15} aria-hidden="true" />
              {t("heroContact")}
            </a>
            <a href={SITE.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconLinkClass}>
              <GithubIcon className="w-[18px] h-[18px]" />
            </a>
            <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconLinkClass}>
              <LinkedinIcon className="w-[18px] h-[18px]" />
            </a>
          </div>

          {stats && (
            <dl {...rise(0.36)} className={`${RISE} mt-10 pt-6 flex gap-8 border-t border-line`}>
              {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="font-mono text-xs text-muted lowercase">{stat.label}</dt>
                  <dd className="font-display text-[2rem] leading-none font-bold text-heading tabular-nums">
                    <AnimatedCounter value={stat.value} duration={900} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div {...rise(0.15)} className={`${RISE} min-w-0`}>
          <Terminal projects={projects} />
        </div>
      </div>
    </section>
  );
}
