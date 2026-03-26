"use client";

import { motion } from "framer-motion";
import { ArrowDown, FolderKanban, CheckCircle2, Rocket } from "lucide-react";
import { StatCard } from "@/components";

interface Stats {
  totalProjects: number;
  totalFinished: number;
  inDevelopment: number;
}

interface HeroSectionProps {
  stats: Stats;
}

export function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/95 to-navy-950" />

      {/* Glow orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />

      <div className="container relative">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 order-first lg:order-last"
          >
            <div className="relative">
              <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-2 border-slate-700/50 ring-4 ring-blue-500/10">
                <img
                  src="/images/foto.jpg"
                  alt="Erich Lima Schlaepfer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-xl -z-10" />
            </div>
          </motion.div>

          {/* Text content */}
          <div className="max-w-5xl flex-1">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-blue-400 font-mono text-sm mb-4 tracking-wider"
          >
            FULL STACK DEVELOPER & DATA ANALYST
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none mb-6"
          >
            <span className="text-slate-50">Erich Lima</span>
            <br />
            <span className="text-gradient">Schlaepfer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12"
          >
            Construo sistemas robustos do banco de dados à interface.
            Especializado em transformar dados complexos em experiências
            intuitivas e insights acionáveis.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 mb-12"
          >
            <StatCard
              label="Projetos"
              value={stats.totalProjects}
              icon={FolderKanban}
              accentColor="#3B82F6"
            />
            <StatCard
              label="Finalizados"
              value={stats.totalFinished}
              icon={CheckCircle2}
              accentColor="#8B5CF6"
            />
            <StatCard
              label="Em Desenvolvimento"
              value={stats.inDevelopment}
              icon={Rocket}
              accentColor="#F59E0B"
            />
          </motion.div>

          {/* CTA */}
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            href="#projects"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors text-sm font-medium hover:no-underline"
          >
            <span>Ver projetos</span>
            <ArrowDown size={16} className="animate-bounce" />
          </motion.a>
          </div>
        </div>
      </div>
    </section>
  );
}
