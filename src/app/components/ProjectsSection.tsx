"use client";

import { SectionHeader } from "@/components";
import { ProjectGrid } from "./ProjectGrid";
import { useI18n } from "@/lib/i18n";

export function ProjectsSection() {
  const { t } = useI18n();

  return (
    <>
      <SectionHeader
        index="02"
        title={t("sectionProjects")}
        subtitle={t("sectionProjectsSub")}
      />
      <ProjectGrid />
    </>
  );
}
