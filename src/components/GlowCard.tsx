"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlowCard({ children, className, delay = 0 }: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        "relative rounded-2xl border border-white/5 bg-navy-800/70 overflow-hidden",
        "transition-all duration-300",
        "hover:border-accent-cyan/30 hover:-translate-y-1 hover:shadow-[0_18px_50px_-20px_rgba(0,0,0,0.7),0_0_40px_-12px_var(--glow-cyan)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
