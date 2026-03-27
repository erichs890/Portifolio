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
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={clsx(
        "relative rounded-lg border border-navy-700/50 bg-navy-800/80 overflow-hidden",
        "transition-all duration-300",
        "hover:border-accent-cyan/30 hover:shadow-[0_0_30px_rgba(100,255,218,0.07)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
