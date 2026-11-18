"use client";

import { Kw, QueryHeading } from "@/components/QueryHeading";
import { useI18n } from "@/lib/i18n";
import { STACK_GROUPS } from "@/lib/stack";

/** Technologies by domain, each with its logo and how many projects on this site use it. */
export function SkillsSection({ usage }: { usage: Record<string, number> | null }) {
  const { t } = useI18n();

  return (
    <>
      <QueryHeading
        sql={
          <>
            <Kw>SELECT</Kw> name, <Kw>COUNT</Kw>(project_id) <Kw>FROM</Kw> technologies <Kw>GROUP BY</Kw> name;
          </>
        }
        title={t("sectionTechStack")}
      >
        <p className="mt-4 max-w-[60ch] text-body">{usage ? t("stackLead") : t("stackLeadNoData")}</p>
      </QueryHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {STACK_GROUPS.map((group) => (
          <section key={group.id} aria-labelledby={`stack-${group.id}`} className="rounded-2xl border border-line bg-surface-1 p-5">
            <h3 id={`stack-${group.id}`} className="!text-base mb-3 font-mono !font-medium !tracking-normal text-muted" style={{ fontStretch: "100%" }}>
              {t(group.label)}
            </h3>
            <ul>
              {group.items.map((item) => {
                const count = usage?.[item.name] ?? 0;
                return (
                  <li key={item.name} className="flex items-center gap-3 min-h-11 border-t border-line first:border-t-0">
                    <span className="grid place-items-center w-6 h-6 shrink-0 text-heading" aria-hidden="true">
                      {item.icon ? (
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                          <path d={item.icon} />
                        </svg>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-line-strong" />
                      )}
                    </span>
                    <span className="flex-1 text-[15px] text-heading">{item.name}</span>
                    {count > 0 && (
                      <span className="font-mono text-xs text-muted tabular-nums">
                        {count} {t(count === 1 ? "countProject" : "countProjects")}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
