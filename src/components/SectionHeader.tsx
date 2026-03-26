"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <div className="flex items-center gap-4 mb-3">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-50">
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-700 to-transparent" />
      </div>
      {subtitle && (
        <p className="text-slate-400 text-lg max-w-2xl">{subtitle}</p>
      )}
    </motion.div>
  );
}
