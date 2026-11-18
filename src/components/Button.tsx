import clsx from "clsx";
import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0";

  const variants = {
    primary:
      "bg-transparent border border-accent-cyan text-accent-cyan hover:bg-accent-cyan/10 hover:shadow-[0_8px_30px_-10px_var(--glow-cyan)] font-mono",
    secondary:
      "bg-navy-800/60 hover:bg-navy-700/60 text-text-primary border border-line hover:border-line-strong",
    danger:
      "bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}
