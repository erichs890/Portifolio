import clsx from "clsx";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            "bg-navy-800 rounded-lg animate-pulse",
            className
          )}
        />
      ))}
    </>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-700 border-t-blue-500" />
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-navy-950">
      <div className="animate-spin rounded-full h-14 w-14 border-2 border-slate-700 border-t-blue-500" />
    </div>
  );
}
