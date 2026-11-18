import { DataSection } from "./components/data/DataSection";
import { HeroSection } from "./components/HeroSection";
import { ProofStrip } from "./components/ProofStrip";
import { SkillsSection } from "./components/SkillsSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { toCardData, toPlaygroundProject } from "@/lib/projects";
import { techUsage } from "@/lib/stack";
import { getPublishedProjects } from "@/lib/publicProjects";

export default async function Home() {
  // One cached query feeds the hero counters, the SQL terminal, the cards and the charts.
  const projects = await getPublishedProjects();
  const cards = projects?.map(toCardData) ?? null;

  return (
    <div className="min-h-screen">
      <HeroSection projects={projects?.map(toPlaygroundProject) ?? null} />

      {cards && <ProofStrip projects={cards} />}

      <section id="projects" className="scroll-mt-20 py-20 md:py-28 border-t border-line">
        <div className="container">
          <ProjectsSection projects={cards} />
        </div>
      </section>

      {cards && cards.length > 0 && (
        <section id="data" className="scroll-mt-20 py-20 md:py-28 border-t border-line">
          <div className="container">
            <DataSection projects={cards} />
          </div>
        </section>
      )}

      <section id="stack" className="scroll-mt-20 py-20 md:py-28 border-t border-line">
        <div className="container">
          <SkillsSection usage={projects ? techUsage(projects) : null} />
        </div>
      </section>
    </div>
  );
}
