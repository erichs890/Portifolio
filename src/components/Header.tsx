import Link from "next/link";
import { auth } from "@/lib/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 bg-navy-900/85 backdrop-blur-xl border-b border-navy-700/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link
          href="/"
          className="font-mono font-bold text-lg text-accent-cyan hover:no-underline hover:opacity-80 transition-opacity"
        >
          {"<"}Erich{" />"}
        </Link>

        <div className="flex items-center gap-6">
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-text-secondary hover:text-accent-cyan text-sm font-mono transition-colors hover:no-underline"
            >
              .admin()
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
