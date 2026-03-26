interface TechBadgeProps {
  name: string;
  color?: string | null;
}

export function TechBadge({ name, color }: TechBadgeProps) {
  const dotColor = color || "#3B82F6";

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/50">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      {name}
    </span>
  );
}
