interface TechBadgeProps {
  name: string;
  color?: string | null;
}

export function TechBadge({ name, color }: TechBadgeProps) {
  const dotColor = color || "#64ffda";

  return (
    <span className="group/badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-navy-950/50 text-text-primary border border-white/5 transition-colors duration-200 hover:border-white/15">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-shadow duration-200"
        style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}99` }}
      />
      {name}
    </span>
  );
}
