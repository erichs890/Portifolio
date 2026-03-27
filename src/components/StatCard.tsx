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
    <div className="relative group rounded-lg border border-navy-700/50 bg-navy-800/50 p-4 transition-all duration-300 hover:border-accent-cyan/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono text-text-secondary mb-1 uppercase tracking-wider">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-text-heading font-mono">
              <AnimatedCounter value={value} />
            </span>
            {suffix && (
              <span className="text-xs text-text-secondary">{suffix}</span>
            )}
          </div>
        </div>
        <div
          className="p-2 rounded"
          style={{ backgroundColor: `${accentColor}10` }}
        >
          <Icon size={18} style={{ color: accentColor }} />
        </div>
      </div>
    </div>
  );
}
