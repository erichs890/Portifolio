"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "pt";

const translations = {
  en: {
    // Hero
    heroGreeting: "> Hi, my name is",
    heroSubtitle: "I turn data into systems.",
    heroDescription:
      "Full Stack Developer & Data Analyst specialized in transforming raw data into scalable applications and business insights. From database to interface.",
    heroCta: "See projects",
    heroContact: "Get in touch",
    heroAvailable: "Available for work",
    heroRole: "Full Stack Developer · Data Analyst",
    scrollHint: "scroll",
    // Stats
    statProjects: "Projects",
    statFinished: "Finished",
    statInDev: "In Development",
    // Sections
    sectionProjects: "Projects",
    sectionProjectsSub:
      "Each project is a complete system — from database to interface. Cards with real metrics.",
    sectionTechStack: "Tech Stack",
    sectionTechStackSub:
      "Technologies organized by domain — from development to deployment.",
    // Tech categories
    techCoreDev: "Core Dev",
    techFrontend: "Frontend",
    techBackend: "Backend & APIs",
    techDatabase: "Database / Supabase",
    techData: "Data & Analytics",
    techDevops: "DevOps & Tools",
    // Project card
    statusInDev: "In Development",
    statusInProd: "In Production",
    statusFinished: "Finished",
    collaborator: "Collaborator",
    coCreator: "Co-Creator",
    featured: "featured",
    // Nav
    navAbout: "About",
    navProjects: "Projects",
    navAdmin: ".admin()",
    // Footer
    footerBuilt: "built with Next.js & TypeScript",
    footerTagline: "Let's build something great together.",
    footerContact: "Get in touch",
    footerRights: "All rights reserved",
    backToTop: "Back to top",
    // About
    aboutTitle: "About Me",
    // Detail page
    backToProjects: "cd ../projects",
    repository: "Repository",
    viewDeploy: "View Deploy",
    gallery: "Gallery",
    projectNotFound: "Project not found",
    projectNotFoundDesc: "The project you're looking for doesn't exist.",
    backToProjectsBtn: "Back to projects",
    // Login
    loginTitle: "Restricted Access",
    loginEmail: "Email",
    loginPassword: "Password",
    loginSubmit: "Sign in",
    loginError: "Invalid email or password",
    loginSuccess: "Login successful!",
    loginErrorGeneric: "Login error",
    // Terminal
    terminalOnline: "online",
    // Misc
    noProjects: "No projects available at the moment.",
  },
  pt: {
    heroGreeting: "> Olá, meu nome é",
    heroSubtitle: "Transformo dados em sistemas.",
    heroDescription:
      "Desenvolvedor Full Stack & Analista de Dados especializado em transformar dados brutos em aplicações escaláveis e insights de negócio. Do banco de dados à interface.",
    heroCta: "Ver projetos",
    heroContact: "Entrar em contato",
    heroAvailable: "Disponível para projetos",
    heroRole: "Desenvolvedor Full Stack · Analista de Dados",
    scrollHint: "rolar",
    statProjects: "Projetos",
    statFinished: "Finalizados",
    statInDev: "Em Desenvolvimento",
    sectionProjects: "Projetos",
    sectionProjectsSub:
      "Cada projeto é um sistema completo — do banco de dados à interface. Cards com métricas reais.",
    sectionTechStack: "Tech Stack",
    sectionTechStackSub:
      "Tecnologias organizadas por domínio — do desenvolvimento ao deploy.",
    techCoreDev: "Core Dev",
    techFrontend: "Frontend",
    techBackend: "Backend & APIs",
    techDatabase: "Database / Supabase",
    techData: "Data & Analytics",
    techDevops: "DevOps & Tools",
    statusInDev: "Em Desenvolvimento",
    statusInProd: "Em Produção",
    statusFinished: "Finalizado",
    collaborator: "Colaborador",
    coCreator: "Co-Criador",
    featured: "destaque",
    navAbout: "Sobre",
    navProjects: "Projetos",
    navAdmin: ".admin()",
    footerBuilt: "feito com Next.js & TypeScript",
    footerTagline: "Vamos construir algo incrível juntos.",
    footerContact: "Fale comigo",
    footerRights: "Todos os direitos reservados",
    backToTop: "Voltar ao topo",
    aboutTitle: "Sobre Mim",
    backToProjects: "cd ../projetos",
    repository: "Repositório",
    viewDeploy: "Ver Deploy",
    gallery: "Galeria",
    projectNotFound: "Projeto não encontrado",
    projectNotFoundDesc: "O projeto que você procura não existe.",
    backToProjectsBtn: "Voltar aos projetos",
    loginTitle: "Acesso Restrito",
    loginEmail: "Email",
    loginPassword: "Senha",
    loginSubmit: "Entrar",
    loginError: "Email ou senha inválidos",
    loginSuccess: "Login realizado com sucesso!",
    loginErrorGeneric: "Erro ao fazer login",
    terminalOnline: "online",
    noProjects: "Nenhum projeto disponível no momento.",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  const toggleLang = () => setLang((prev) => (prev === "en" ? "pt" : "en"));
  const t = (key: TranslationKey) => translations[lang][key] || key;

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
