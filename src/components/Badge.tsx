import clsx from "clsx";
import { ProjectStatus } from "@/types";

interface BadgeProps {
  variant?:
    | "default"
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-slate-800 text-slate-300 border-slate-700/50",
    primary: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    info: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  return (
    <span
      className={clsx(
        "inline-block px-2.5 py-0.5 rounded-md text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: ProjectStatus;
  featured?: boolean;
  published?: boolean;
}

export function StatusBadge({
  status,
  featured,
  published,
}: StatusBadgeProps) {
  const statusMapping = {
    IN_DEVELOPMENT: { label: "Em Desenvolvimento", variant: "warning" as const },
    IN_PRODUCTION: { label: "Em Produção", variant: "success" as const },
    FINISHED: { label: "Finalizado", variant: "info" as const },
  };

  const statusInfo = statusMapping[status];

  return (
    <div className="flex gap-2 flex-wrap">
      <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      {featured && <Badge variant="primary">Destaque</Badge>}
      {!published && <Badge variant="danger">Não Publicado</Badge>}
    </div>
  );
}
