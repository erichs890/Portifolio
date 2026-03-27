import { ReactNode } from "react";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = false }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg bg-navy-800 border border-navy-700/50",
        hoverable &&
          "hover:border-accent-cyan/30 hover:shadow-[0_0_30px_rgba(100,255,218,0.07)] hover:scale-[1.01] transition-all duration-300 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CardImage({ src, alt, className }: CardImageProps) {
  return (
    <div className="relative overflow-hidden rounded-t-lg">
      <img src={src} alt={alt} className={clsx("w-full object-contain", className)} />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-800/60 to-transparent pointer-events-none" />
    </div>
  );
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={clsx("p-5", className)}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={clsx("px-5 py-3 border-t border-navy-700/50 flex gap-2", className)}>
      {children}
    </div>
  );
}
