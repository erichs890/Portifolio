import { Metadata } from "next";
import { HeroSection } from "./components/HeroSection";
import { ProjectGrid } from "@/app/components/ProjectGrid";
import { SkillsSection } from "./components/SkillsSection";
import { SectionHeader } from "@/components";
import { projectService } from "@/services/project.service";

export const metadata: Metadata = {
  title: "Erich Lima Schlaepfer | Full Stack Developer & Data Analyst",
  description:
    "Portfólio de Erich Lima Schlaepfer — Full Stack Developer especializado em análise de dados e sistemas robustos.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  let stats = { totalProjects: 0, totalFinished: 0, inDevelopment: 0, inProduction: 0 };

  try {
    const result = await projectService.getAllProjects(1, 100);
    const projects = result.data;
    stats = {
      totalProjects: projects.length,
      totalFinished: projects.filter((p) => p.status === "FINISHED").length,
      inDevelopment: projects.filter((p) => p.status === "IN_DEVELOPMENT").length,
      inProduction: projects.filter((p) => p.status === "IN_PRODUCTION").length,
    };
  } catch {
    // Stats will remain at 0
  }

  return (
    <div className="min-h-screen">
      <HeroSection stats={stats} />

      <section className="py-20 md:py-28 border-t border-slate-800">
        <div className="container">
          <SkillsSection />
        </div>
      </section>

      <section id="projects" className="py-20 md:py-28 border-t border-slate-800">
        <div className="container">
          <SectionHeader
            title="Projetos"
            subtitle="Cada projeto é um sistema completo — do banco de dados à interface. Cards com métricas reais."
          />
          <ProjectGrid />
        </div>
      </section>
    </div>
  );
}
