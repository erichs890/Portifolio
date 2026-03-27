"use client";

import { Code2, ExternalLink, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="bg-navy-950 border-t border-navy-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-text-heading font-semibold">
              Erich Lima Schlaepfer
            </p>
            <p className="text-text-secondary text-sm mt-1 font-mono">
              Full Stack Developer & Data Analyst
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/erichs890"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-cyan transition-colors"
              aria-label="GitHub"
            >
              <Code2 size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/erich-schlaepfer/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-cyan transition-colors"
              aria-label="LinkedIn"
            >
              <ExternalLink size={18} />
            </a>
            <a
              href="https://wa.me/5585992555946"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent-cyan transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>

          <p className="text-text-muted text-xs font-mono">
            &copy; {currentYear} // {t("footerBuilt")}
          </p>
        </div>
      </div>
    </footer>
  );
}
