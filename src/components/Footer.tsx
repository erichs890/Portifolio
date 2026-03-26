import { Code2, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-slate-50 font-semibold">
              Erich Lima Schlaepfer
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Full Stack Developer & Data Analyst
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/erichs890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="GitHub"
            >
              <Code2 size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/erich-schlaepfer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="LinkedIn"
            >
              <ExternalLink size={20} />
            </a>
          </div>

          <p className="text-slate-600 text-xs">
            &copy; {currentYear} &middot; Next.js, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
