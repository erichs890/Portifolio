"use client";

import Image from "next/image";
import Link from "next/link";
import { FileText, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { formatProjectDate, localized, type ProjectCardData } from "@/lib/projects";
import { SITE } from "@/lib/site";
import { ROLE_LABEL } from "@/app/components/projects/ProjectParts";

interface TimelineEntry {
  key: string;
  period: string;
  title: string;
  detail: string;
  href?: string;
}

export function AboutClient({ collaborations }: { collaborations: ProjectCardData[] }) {
  const { t, lang } = useI18n();

  const entries: TimelineEntry[] = [
    { key: "degree", period: t("aboutOngoing"), title: t("aboutDegree"), detail: t("aboutDegreePlace") },
    ...collaborations.map((project) => ({
      key: project.slug,
      period: formatProjectDate(project.date, lang),
      title: localized(lang, project.title, project.titleEn),
      detail: t(ROLE_LABEL[project.role]),
      href: `/projects/${project.slug}`,
    })),
  ];

  return (
    <div className="container pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] gap-10 lg:gap-16 items-start">
        <aside className="lg:sticky lg:top-24">
          <div className="relative w-48 h-48 lg:w-full lg:h-auto lg:aspect-square rounded-2xl overflow-hidden border border-line">
            <Image src="/images/foto.jpg" alt={t("aboutPhotoAlt")} fill sizes="(min-width: 1024px) 288px, 192px" className="object-cover" priority />
          </div>
          <p className="mt-4 inline-flex items-center gap-2 font-mono text-sm text-muted">
            <MapPin size={15} aria-hidden="true" />
            {t("aboutLocation")}
          </p>
          {SITE.cvUrl && (
            <a href={SITE.cvUrl} download className="btn-primary mt-5 w-full justify-center hover:no-underline">
              <FileText size={15} aria-hidden="true" />
              {t("aboutDownloadCv")}
            </a>
          )}
        </aside>

        <div className="min-w-0">
          <h1 className="!text-[clamp(2.25rem,5vw,4rem)] mb-8">{t("aboutTitle")}</h1>
          <div className="grid gap-5 max-w-[65ch] text-[1.0625rem] leading-[1.75] text-body">
            <p>{t("aboutP1")}</p>
            <p>{t("aboutP2")}</p>
            <p>{t("aboutP3")}</p>
          </div>

          <h2 className="!text-2xl mt-14 mb-6">{t("aboutTimeline")}</h2>
          <ol className="max-w-[65ch] border-l border-line-strong">
            {entries.map((entry) => (
              <li key={entry.key} className="relative pl-6 pb-7 last:pb-0">
                <span className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full bg-accent ring-4 ring-bg" aria-hidden="true" />
                <p className="font-mono text-xs text-muted">{entry.period}</p>
                <p className="mt-1 font-display font-bold text-lg text-heading">
                  {entry.href ? (
                    <Link href={entry.href} className="inline-block py-2.5 text-heading hover:text-accent-text hover:no-underline transition-colors">
                      {entry.title}
                    </Link>
                  ) : (
                    entry.title
                  )}
                </p>
                <p className="text-[15px] text-body">{entry.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
