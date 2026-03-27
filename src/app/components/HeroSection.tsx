"use client";

import { motion } from "framer-motion";
import { ArrowDown, FolderKanban, CheckCircle2, Rocket } from "lucide-react";
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

function DataTerminal({ stats }: { stats: Stats }) {
  const rows = [
    { status: "IN_DEVELOPMENT", count: stats.inDevelopment, color: "text-amber-400" },
    { status: "FINISHED", count: stats.totalFinished, color: "text-emerald-400" },
    { status: "IN_PRODUCTION", count: stats.inProduction, color: "text-blue-400" },
  ].filter((r) => r.count > 0);

  return (
    <div className="rounded-lg border border-navy-700 bg-navy-900 overflow-hidden font-mono text-xs sm:text-sm">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-navy-800 border-b border-navy-700">
        <span className="w-3 h-3 rounded-full bg-rose-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-500/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-2 text-accent-slate text-xs">portfolio_db — psql</span>
      </div>
      {/* Terminal body */}
      <div className="p-4 space-y-2 text-accent-slate leading-relaxed">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <span className="text-accent-cyan">erich@db</span>
          <span className="text-text-secondary">=# </span>
          <span className="text-text-primary">SELECT status, COUNT(*) FROM projects</span>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <span className="text-text-secondary">{"     "}</span>
          <span className="text-text-primary">GROUP BY status;</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="pt-2 border-t border-navy-700 mt-2"
        >
          <div className="grid grid-cols-[1fr_60px] gap-x-4">
            <span className="text-text-heading font-semibold">status</span>
            <span className="text-text-heading font-semibold text-right">count</span>
          </div>
          <div className="border-b border-navy-700 my-1" />
          {rows.map((row) => (
            <div key={row.status} className="grid grid-cols-[1fr_60px] gap-x-4">
              <span className={row.color}>{row.status}</span>
              <span className="text-accent-cyan text-right">{row.count}</span>
            </div>
          ))}
          <div className="border-t border-navy-700 mt-1 pt-1">
            <div className="grid grid-cols-[1fr_60px] gap-x-4 text-text-secondary">
              <span>({rows.length} rows)</span>
              <span />
            </div>
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
  );
}

export function HeroSection({ stats }: HeroSectionProps) {
  const { t } = useI18n();

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950" />

      {/* Glow orbs */}
      <div className="absolute top-20 -left-32 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-accent-emerald/5 rounded-full blur-3xl" />

      <div className="container relative">
        {/* Asymmetric 60/40 grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left side — 60% */}
          <div className="lg:col-span-3">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-accent-cyan font-mono text-sm mb-5 tracking-wider"
            >
              {t("heroGreeting")}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-3"
            >
              <span className="text-text-heading">Erich Lima</span>
              <br />
              <span className="text-gradient">Schlaepfer.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base md:text-lg text-text-secondary max-w-xl mb-10 leading-relaxed"
            >
              {t("heroDescription")}
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              <StatCard
                label={t("statProjects")}
                value={stats.totalProjects}
                icon={FolderKanban}
                accentColor="#64ffda"
              />
              <StatCard
                label={t("statFinished")}
                value={stats.totalFinished}
                icon={CheckCircle2}
                accentColor="#10B981"
              />
              <StatCard
                label={t("statInDev")}
                value={stats.inDevelopment}
                icon={Rocket}
                accentColor="#F59E0B"
              />
            </motion.div>

            {/* CTA */}
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              href="#projects"
              className="inline-flex items-center gap-2 btn-primary hover:no-underline"
            >
              <span>{t("heroCta")}</span>
              <ArrowDown size={14} className="animate-bounce" />
            </motion.a>
          </div>

          {/* Right side — 40% (Data Terminal) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="lg:col-span-2"
          >
            <DataTerminal stats={stats} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
