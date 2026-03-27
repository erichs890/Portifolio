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
        <h2 className="text-2xl md:text-3xl font-bold text-text-heading">
          <span className="text-accent-cyan font-mono font-normal text-xl mr-2">//</span>
          {title}
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-navy-700 to-transparent" />
      </div>
      {subtitle && (
        <p className="text-text-secondary text-base max-w-2xl">{subtitle}</p>
      )}
    </motion.div>
  );
}
