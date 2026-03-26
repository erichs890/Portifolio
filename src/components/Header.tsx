import Link from "next/link";
import { auth } from "@/lib/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link
          href="/"
          className="font-bold text-xl text-slate-50 hover:no-underline"
        >
          <span className="text-gradient">Erich</span>
          <span className="hidden sm:inline text-slate-400 font-normal text-sm ml-2">
            Portfolio
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-slate-400 hover:text-slate-50 text-sm font-medium transition-colors hover:no-underline"
          >
            Projetos
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="text-slate-400 hover:text-slate-50 text-sm font-medium transition-colors hover:no-underline"
            >
              Admin
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
