import clsx from "clsx";
import { ReactNode } from "react";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
    "font-medium rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
    secondary:
      "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700",
    danger:
      "bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
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
