"use client";

import Image from "next/image";
import { CircleCheck, Hammer, Rocket, type LucideIcon } from "lucide-react";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import type { ProjectCategory, ProjectRole, ProjectStatus } from "@/types";

export const STATUS_META: Record<ProjectStatus, { label: TranslationKey; icon: LucideIcon; className: string }> = {
  IN_PRODUCTION: { label: "statusInProd", icon: Rocket, className: "text-status-prod border-status-prod/40" },
  IN_DEVELOPMENT: { label: "statusInDev", icon: Hammer, className: "text-status-dev border-status-dev/40" },
  FINISHED: { label: "statusFinished", icon: CircleCheck, className: "text-status-done border-status-done/40" },
};

export const ROLE_LABEL: Record<ProjectRole, TranslationKey> = {
  CREATOR: "roleCreator",
  CO_CREATOR: "coCreator",
  COLLABORATOR: "collaborator",
};

export const CATEGORY_LABEL: Record<ProjectCategory, TranslationKey> = {
  WEB: "catWeb",
  MOBILE: "catMobile",
  DATA: "catData",
  AI: "catAi",
  SECURITY: "catSecurity",
  SYSTEMS: "catSystems",
};

const pillClass = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-xs font-medium";

/** Status is never colour alone: icon + text + colour. */
export function StatusPill({ status }: { status: ProjectStatus }) {
  const { t } = useI18n();
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span className={`${pillClass} ${meta.className}`}>
      <Icon size={12} aria-hidden="true" />
      {t(meta.label)}
    </span>
  );
}

export function RolePill({ role }: { role: ProjectRole }) {
  const { t } = useI18n();
  return <span className={`${pillClass} border-line text-body`}>{t(ROLE_LABEL[role])}</span>;
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li key={tag} className="px-2 py-0.5 rounded-md border border-line bg-surface-2 font-mono text-xs text-body">
          {tag}
        </li>
      ))}
    </ul>
  );
}

interface CoverProps {
  src: string | null;
  alt: string;
  /** Text for the fake address bar; omit for a frameless cover. */
  address?: string;
  sizes: string;
  priority?: boolean;
}

/** Every cover sits in the same 16:10 window, cropped from the top-left so headers and sidebars stay visible. */
export function ProjectCover({ src, alt, address, sizes, priority }: CoverProps) {
  return (
    <div className="overflow-hidden bg-surface-2">
      {address && (
        <div className="flex items-center gap-1.5 px-2.5 py-2 border-b border-line">
          <span className="w-2 h-2 rounded-full bg-line-strong" />
          <span className="w-2 h-2 rounded-full bg-line-strong" />
          <span className="w-2 h-2 rounded-full bg-line-strong" />
          <span className="ml-2 flex-1 max-w-64 truncate px-2.5 rounded-md border border-line bg-surface-1 font-mono text-[11px] leading-5 text-muted">
            {address}
          </span>
        </div>
      )}
      <div className="relative aspect-[16/10]">
        {src ? (
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-left-top" />
        ) : (
          <div className="absolute inset-0 bg-dot-grid" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}
