import type { Metadata } from "next";
import { resolveLang } from "@/lib/lang.server";
import { sortByNewest, toCardData } from "@/lib/projects";
import { getPublishedProjects } from "@/lib/publicProjects";
import { SITE_COPY } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { AboutClient } from "./AboutClient";

export async function generateMetadata(): Promise<Metadata> {
  const copy = SITE_COPY[await resolveLang()];
  return {
    title: `${copy.about} | ${SITE.name}`,
    description: copy.aboutDescription,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  // Projects done with other people (co-creator or collaborator) feed the timeline.
  const projects = (await getPublishedProjects()) ?? [];
  const collaborations = sortByNewest(projects.map(toCardData).filter((project) => project.role !== "CREATOR"));
  return <AboutClient collaborations={collaborations} />;
}
