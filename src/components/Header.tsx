import Link from "next/link";
import { auth } from "@/lib/auth";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 bg-navy-950/70 backdrop-blur-xl border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <Link
          href="/"
          className="font-mono font-bold text-lg text-accent-cyan hover:no-underline hover:opacity-80 transition-opacity"
        >
          <span className="text-text-muted">{"<"}</span>Erich<span className="text-text-muted">{" />"}</span>
        </Link>

        <div className="flex items-center gap-2">
          {session?.user?.role === "ADMIN" && (
            <Link href="/admin" className="btn-ghost hover:no-underline">
              .admin()
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
