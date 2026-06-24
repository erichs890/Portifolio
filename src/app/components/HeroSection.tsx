"use client";

import { motion } from "framer-motion";
import { ArrowDown, FolderKanban, CheckCircle2, Rocket, MessageCircle } from "lucide-react";
import { StatCard } from "@/components";
import { useI18n } from "@/lib/i18n";

interface Stats {
  totalProjects: number;
  totalFinished: number;
  inDevelopment: number;
  inProduction: number;
}

interface HeroSectionProps {
  stats: Stats;
}

const EASE = [0.16, 1, 0.3, 1] as const;

function DataTerminal({ stats }: { stats: Stats }) {
  const rows = [
    { status: "IN_DEVELOPMENT", count: stats.inDevelopment, color: "text-amber-400" },
    { status: "FINISHED", count: stats.totalFinished, color: "text-emerald-400" },
    { status: "IN_PRODUCTION", count: stats.inProduction, color: "text-blue-400" },
  ].filter((r) => r.count > 0);

  return (
    <div className="relative">
      {/* Ambient glow behind terminal */}
      <div className="absolute -inset-4 bg-accent-cyan/10 rounded-3xl blur-2xl -z-10" />

      <div className="glass rounded-2xl overflow-hidden font-mono text-xs sm:text-sm shadow-[0_24px_70px_-30px_rgba(0,0,0,0.9)]">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-navy-950/60 border-b border-white/5">
          <span className="w-3 h-3 rounded-full bg-rose-500/90" />
          <span className="w-3 h-3 rounded-full bg-amber-500/90" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
          <span className="ml-2 text-text-secondary text-xs tracking-wide">portfolio_db — psql</span>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400/90">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            online
          </span>
        </div>

        {/* Terminal body */}
        <div className="p-5 space-y-2 text-text-secondary leading-relaxed font-mono-data">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <span className="text-accent-cyan">erich@db</span>
            <span className="text-text-secondary">=# </span>
            <span className="text-text-primary">SELECT status, COUNT(*) FROM projects</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <span className="text-text-secondary">{"     "}</span>
            <span className="text-text-primary">GROUP BY status;</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, ease: EASE }}
            className="pt-3 mt-2 border-t border-white/5"
          >
            <div className="grid grid-cols-[1fr_64px] gap-x-4 text-text-heading">
              <span className="font-semibold">status</span>
              <span className="font-semibold text-right">count</span>
            </div>
            <div className="border-b border-white/5 my-1.5" />
            {rows.map((row, i) => (
              <motion.div
                key={row.status}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5 + i * 0.15, ease: EASE }}
                className="grid grid-cols-[1fr_64px] gap-x-4 py-0.5"
              >
                <span className={row.color}>{row.status}</span>
                <span className="text-accent-cyan text-right">{row.count}</span>
              </motion.div>
            ))}
            <div className="border-t border-white/5 mt-1.5 pt-1.5">
              <span className="text-text-muted">({rows.length} rows)</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2 }}
            className="pt-2"
          >
            <span className="text-accent-cyan">erich@db</span>
            <span className="text-text-secondary">=# </span>
            <span className="animate-blink text-accent-cyan">▋</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection({ stats }: HeroSectionProps) {
  const { t } = useI18n();

  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
      {/* Floating glow orbs */}
      <div className="absolute top-10 -left-40 w-[28rem] h-[28rem] bg-accent-cyan/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute -bottom-20 right-0 w-[26rem] h-[26rem] bg-accent-violet/10 rounded-full blur-[120px] animate-float [animation-delay:-3s]" />

      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left — 60% */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 chip mb-6 !rounded-full !py-1.5 !px-3"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-emerald-300/90">{t("heroAvailable")}</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
              className="eyebrow mb-4"
            >
              {t("heroGreeting")}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] mb-4"
            >
              <span className="text-text-heading">Erich Lima</span>
              <br />
              <span className="text-gradient">Schlaepfer.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
              className="font-mono text-sm text-accent-slate mb-6 tracking-wide"
            >
              {t("heroRole")}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32, ease: EASE }}
              className="text-base md:text-lg text-text-secondary max-w-xl mb-9 leading-relaxed"
            >
              {t("heroDescription")}
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
              className="grid grid-cols-3 gap-3 mb-9 max-w-lg"
            >
              <StatCard label={t("statProjects")} value={stats.totalProjects} icon={FolderKanban} accentColor="#64ffda" />
              <StatCard label={t("statFinished")} value={stats.totalFinished} icon={CheckCircle2} accentColor="#10B981" />
              <StatCard label={t("statInDev")} value={stats.inDevelopment} icon={Rocket} accentColor="#F59E0B" />
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
              className="flex flex-wrap items-center gap-3"
            >
              <a href="#projects" className="btn-primary hover:no-underline group">
                <span>{t("heroCta")}</span>
                <ArrowDown size={15} className="transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
              <a
                href="https://wa.me/5585992555946"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary hover:no-underline"
              >
                <MessageCircle size={15} />
                <span>{t("heroContact")}</span>
              </a>
            </motion.div>
          </div>

          {/* Right — 40% (terminal) */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            className="lg:col-span-2"
          >
            <DataTerminal stats={stats} />
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.a
          href="#projects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="hidden md:flex items-center gap-2 mt-16 text-text-muted hover:text-accent-cyan w-fit mx-auto font-mono text-xs uppercase tracking-[0.2em] transition-colors hover:no-underline"
        >
          <span>{t("scrollHint")}</span>
          <ArrowDown size={13} className="animate-bounce" />
        </motion.a>
      </div>
    </section>
  );
}
