"use client";

import { type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  accentColor?: string;
  suffix?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accentColor = "#64ffda",
  suffix = "",
}: StatCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-white/5 bg-navy-800/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/10"
      style={{ ["--c" as string]: accentColor }}
    >
      {/* hover glow wash */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(120px 80px at 80% 0%, ${accentColor}1f, transparent 70%)` }}
      />
      <div className="relative flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] sm:text-xs font-mono text-text-secondary mb-1.5 uppercase tracking-[0.15em] truncate">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl sm:text-3xl font-bold text-text-heading font-mono-data">
              <AnimatedCounter value={value} />
            </span>
            {suffix && <span className="text-xs text-text-secondary">{suffix}</span>}
          </div>
        </div>
        <div
          className="shrink-0 p-2 rounded-lg transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${accentColor}14`, border: `1px solid ${accentColor}22` }}
        >
          <Icon size={18} style={{ color: accentColor }} />
        </div>
      </div>
      {/* bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-px w-0 transition-all duration-500 group-hover:w-full"
        style={{ background: `linear-gradient(90deg, ${accentColor}, transparent)` }}
      />
    </div>
  );
}
