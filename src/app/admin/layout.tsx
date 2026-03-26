"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin
          </h2>
        </div>

        <nav className="mt-6 space-y-2 px-4 pb-24 lg:pb-0">
          <Link
            href="/admin"
            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/projects"
            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            Projetos
          </Link>
          <Link
            href="/admin/projects/new"
            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            Novo Projeto
          </Link>
        </nav>

        <div className="fixed bottom-0 left-0 right-0 lg:static p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:border-t">
          <Button
            onClick={handleLogout}
            variant="danger"
            size="sm"
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Painel Administrativo
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
