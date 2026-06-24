"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  index?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export function SectionHeader({ title, subtitle, index }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mb-12"
    >
      <div className="flex items-center gap-4 mb-3">
        {index && (
          <span className="font-mono text-sm text-accent-cyan/70 tabular-nums">{index}</span>
        )}
        <h2 className="font-display text-3xl md:text-4xl font-bold text-text-heading tracking-tight">
          <span className="text-accent-cyan font-mono font-normal text-xl mr-2">//</span>
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-accent-cyan/30 via-navy-700 to-transparent" />
      </div>
      {subtitle && (
        <p className="text-text-secondary text-base max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </motion.div>
  );
}
