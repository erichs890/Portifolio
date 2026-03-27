"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const aboutEN = `Hi, I'm **Erich Lima Schlaepfer**, a Computer Science student and Full Stack Developer focused on building efficient, scalable, and user-friendly digital solutions.

I have experience in **Web and Mobile Development**, with strong skills in **Python**, and I'm continuously expanding my knowledge in **cybersecurity** as a penetration tester. I also study **Data Analysis**, creating dashboards that transform data into clear and actionable insights.

I enjoy turning ideas into real-world applications, solving problems through code, and constantly improving my technical skills. My goal is to deliver clean, high-quality solutions that combine **performance**, **usability**, and **security**.

I'm always open to new challenges and opportunities to grow as a developer.`;

const aboutPT = `Olá, sou **Erich Lima Schlaepfer**, estudante de Ciência da Computação e Desenvolvedor Full Stack focado em construir soluções digitais eficientes, escaláveis e fáceis de usar.

Tenho experiência em **Desenvolvimento Web e Mobile**, com fortes habilidades em **Python**, e estou continuamente expandindo meu conhecimento em **cibersegurança** como pentester. Também estudo **Análise de Dados**, criando dashboards que transformam dados em insights claros e acionáveis.

Gosto de transformar ideias em aplicações reais, resolver problemas através de código e melhorar constantemente minhas habilidades técnicas. Meu objetivo é entregar soluções limpas e de alta qualidade que combinem **performance**, **usabilidade** e **segurança**.

Estou sempre aberto a novos desafios e oportunidades para crescer como desenvolvedor.`;

export default function AboutPage() {
  const { lang, t } = useI18n();
  const text = lang === "en" ? aboutEN : aboutPT;

  return (
    <div className="min-h-screen">
      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-950/95" />

        <div className="container relative max-w-3xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-cyan text-sm font-mono mb-10 transition-colors hover:no-underline"
          >
            <ArrowLeft size={14} />
            cd ../home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-text-heading mb-2">
              <span className="text-accent-cyan font-mono font-normal text-xl mr-2">//</span>
              {t("aboutTitle")}
            </h1>
            <div className="h-px bg-gradient-to-r from-navy-700 to-transparent mb-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-lg overflow-hidden border border-navy-700 ring-2 ring-accent-cyan/10">
                  <img
                    src="/images/foto.jpg"
                    alt="Erich Lima Schlaepfer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -inset-2 rounded-lg bg-accent-cyan/5 blur-xl -z-10" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-4 text-text-secondary leading-relaxed">
              {text.split("\n\n").map((paragraph, i) => (
                <p key={i} dangerouslySetInnerHTML={{
                  __html: paragraph.replace(
                    /\*\*(.*?)\*\*/g,
                    '<span class="text-text-heading font-medium">$1</span>'
                  ),
                }} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
