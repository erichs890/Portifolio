interface TechBadgeProps {
  name: string;
  color?: string | null;
}

export function TechBadge({ name, color }: TechBadgeProps) {
  const dotColor = color || "#64ffda";

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-navy-900/80 text-text-primary border border-navy-700/50">
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: dotColor }}
      />
      {name}
    </span>
  );
}
