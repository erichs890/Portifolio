"use client";

import { useState } from "react";
import { ArrowUp, Check, Copy, Mail, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";

function CopyEmail({ email }: { email: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address stays visible and selectable next to the button.
    }
  };

  return (
    <div className="inline-flex items-stretch rounded-[10px] border border-line-strong overflow-hidden">
      <a href={`mailto:${email}`} className="inline-flex items-center gap-2 min-h-11 px-4 text-[15px] font-semibold text-heading hover:bg-surface-2 hover:no-underline">
        <Mail size={15} aria-hidden="true" />
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={t("contactCopy")}
        title={t("contactCopy")}
        className="grid place-items-center w-11 border-l border-line-strong text-heading hover:bg-surface-2 cursor-pointer"
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? t("contactCopied") : ""}
      </span>
    </div>
  );
}

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="scroll-mt-20 border-t border-line">
      <div className="container py-20 md:py-28">
        <h2 className="!text-[clamp(2.25rem,6vw,4.5rem)] max-w-[14ch]">{t("contactTitle")}</h2>
        <p className="mt-5 max-w-[50ch] text-[clamp(1rem,1.3vw,1.15rem)] text-body">{t(SITE.email ? "contactLead" : "contactLeadNoEmail")}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary hover:no-underline">
            <MessageCircle size={16} aria-hidden="true" />
            WhatsApp
          </a>
          {SITE.email && <CopyEmail email={SITE.email} />}
          <a href={SITE.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary hover:no-underline">
            <LinkedinIcon className="w-4 h-4" />
            LinkedIn
          </a>
          <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="btn-secondary hover:no-underline">
            <GithubIcon className="w-4 h-4" />
            GitHub
          </a>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container py-6 flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 font-mono text-xs text-muted">
          <p>
            © {year} {SITE.name}
          </p>
          <p>{t("footerBuilt")}</p>
          <p className="sm:mr-auto">{t("footerEgg")}</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label={t("backToTop")}
            title={t("backToTop")}
            className="grid place-items-center w-11 h-11 rounded-[10px] border border-line bg-surface-1 text-body hover:border-line-strong hover:text-heading transition-colors cursor-pointer"
          >
            <ArrowUp size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
