import { Metadata } from "next";
import { HeroSection } from "./components/HeroSection";
import { SkillsSection } from "./components/SkillsSection";
import { ProjectsSection } from "./components/ProjectsSection";
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
          <ProjectsSection />
        </div>
      </section>
    </div>
  );
}
