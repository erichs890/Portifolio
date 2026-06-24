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
      <section className="pt-24 pb-20 md:pt-28 md:pb-28 relative">
        <div className="absolute top-0 -left-32 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[120px] -z-10" />

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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow mb-3">// whoami</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-text-heading mb-3 tracking-tight">
              {t("aboutTitle")}
            </h1>
            <div className="h-px bg-gradient-to-r from-accent-cyan/30 via-navy-700 to-transparent mb-12" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row gap-10 items-start"
          >
            {/* Photo */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="group relative">
                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/10 ring-1 ring-accent-cyan/10">
                  <img
                    src="/images/foto.jpg"
                    alt="Erich Lima Schlaepfer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute -inset-3 rounded-2xl bg-accent-cyan/10 blur-2xl -z-10" />
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 chip !rounded-full whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Fortaleza, BR
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="space-y-5 text-text-secondary leading-relaxed text-[15px] md:text-base">
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
