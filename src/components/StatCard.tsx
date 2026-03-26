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
  accentColor = "var(--accent-blue)",
  suffix = "",
}: StatCardProps) {
  return (
    <div className="relative group rounded-xl border border-slate-700/50 bg-navy-800/50 p-5 transition-all duration-300 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-50">
              <AnimatedCounter value={value} />
            </span>
            {suffix && (
              <span className="text-sm text-slate-400">{suffix}</span>
            )}
          </div>
        </div>
        <div
          className="p-2.5 rounded-lg"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <Icon size={20} style={{ color: accentColor }} />
        </div>
      </div>
    </div>
  );
}
