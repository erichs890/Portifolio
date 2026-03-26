# Agent Log — Portfólio Erich Lima Schlaepfer

## Visão Geral

Redesign completo do portfólio pessoal com estética **Data-Driven Dark Mode** (Deep Navy + Slate), transformando um portfólio simples em uma plataforma visual que demonstra expertise em Full Stack e Análise de Dados. Backend (Prisma, NextAuth, PostgreSQL/Supabase) mantido intacto — migração para Supabase Auth/JS planejada para fase futura (sistema IBA).

---

## Stack Tecnológica

- **Framework**: Next.js 16 + TypeScript
- **Styling**: Tailwind CSS v4 (dark-only theme)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma 5.20
- **Auth**: NextAuth.js (credentials provider, JWT)
- **Storage**: Cloudinary (upload de imagens)
- **Novas libs**: lucide-react (ícones), recharts (sparklines), framer-motion (animações)

---

## Mudanças Realizadas

### Tema & Design System

| Arquivo | Mudança |
|---------|---------|
| `tailwind.config.ts` | Nova paleta: navy-950/900/800/700, accent-blue/emerald/amber/rose/violet. Typography config para dark mode. |
| `src/app/globals.css` | Reescrito: CSS variables, dark-only (sem light mode), classes utilitárias (.text-gradient, .bg-grid-pattern, .glow-blue), animações (fade-in-up, pulse-glow). |
| `src/app/layout.tsx` | `<html className="dark">` fixo. Metadata atualizada. Toaster com tema navy. |

### Novos Componentes

| Componente | Descrição |
|------------|-----------|
| `src/components/StatCard.tsx` | Card de métrica com ícone lucide, label e AnimatedCounter |
| `src/components/AnimatedCounter.tsx` | Número que anima de 0 ao valor final via IntersectionObserver |
| `src/components/SparklineChart.tsx` | Mini gráfico de linha (recharts) para cards de projeto |
| `src/components/TechBadge.tsx` | Badge com dot colorido da cor da tecnologia |
| `src/components/GlowCard.tsx` | Card com hover glow + animação framer-motion |
| `src/components/SectionHeader.tsx` | Header de seção com título + linha decorativa gradient |

### Componentes Atualizados

| Componente | Mudança |
|------------|---------|
| `src/components/Header.tsx` | Fundo navy-900/80 com backdrop-blur-xl. Logo "Erich Portfolio". |
| `src/components/Footer.tsx` | Links para GitHub (erichs890) e LinkedIn. Ícones lucide. |
| `src/components/Card.tsx` | Fundo navy-800, borda slate-700/50, hover glow azul. |
| `src/components/Badge.tsx` | Variantes atualizadas para paleta navy (bg transparente + border). |
| `src/components/Button.tsx` | Variantes navy, hover glow, cursor-pointer. |
| `src/components/Loading.tsx` | Spinner com border-t-blue-500, skeleton navy-800. |
| `src/components/index.ts` | Exports dos 6 novos componentes. |

### Páginas

| Página | Mudança |
|--------|---------|
| `src/app/page.tsx` | Server component. Busca stats via projectService (server-side). Renderiza HeroSection + SkillsSection + ProjectGrid. |
| `src/app/components/HeroSection.tsx` | Foto circular com glow. Nome com text-gradient. 3 StatCards (Projetos, Finalizados, Em Desenvolvimento) recebidos como props do servidor. CTA "Ver projetos". Background grid pattern + glow orbs. |
| `src/app/components/SkillsSection.tsx` | 5 cards de expertise: Desenvolvimento de Software (Python), Frontend (HTML/CSS/JS/React/React Native), Backend (Node.js), Banco de Dados (SQL/Supabase), Análise de Dados (Pandas). |
| `src/app/components/ProjectGrid.tsx` | Mini-dashboard cards: cover image com gradient overlay, status com dot colorido, sparkline, TechBadges, hover scale + glow. Animação stagger com framer-motion. |
| `src/app/projects/[slug]/page.tsx` | Redesign dark: badges de status, data com ícone Calendar, tech badges, botões com ícones (repositório/deploy), galeria com hover zoom. Views removidas. |
| `src/app/login/page.tsx` | Tema navy. Ícone Lock. Sem credenciais de teste visíveis. |

### Admin / Formulário de Projetos

| Arquivo | Mudança |
|---------|---------|
| `src/app/admin/projects/ProjectForm.tsx` | Tecnologias agora são digitadas separadas por vírgula (cria automaticamente se não existir). Upload de imagem: colar do clipboard (Ctrl+V) ou drag & drop / selecionar arquivo. Preview das tech tags em tempo real. Tema navy nos cards do form. |

### Backend / Validação

| Arquivo | Mudança |
|---------|---------|
| `src/lib/validation.ts` | Descrição max aumentado para 2000 chars. URLs sem validação .url() (aceita string vazia). |
| `src/services/project.service.ts` | Removido incrementViews do getProjectBySlug (views não são mais exibidas). |
| `src/app/api/admin/projects/route.ts` | Adicionado console.error no catch do POST para debug. |
| `prisma/seed.ts` | Removidos projetos mock. Só cria admin user + tecnologias base. Removido log de credenciais. |
| `package.json` | Adicionado `postinstall: "prisma generate"` e `build: "prisma generate && next build"` para Vercel. Adicionado `prisma.seed` config. |

### Configuração

| Arquivo | Mudança |
|---------|---------|
| `.env` / `.env.local` | DATABASE_URL atualizada múltiplas vezes (senha do Supabase mudou após restaurações). |
| `public/images/` | Pasta criada para foto de perfil (`foto.jpg`). |

---

## Decisões Arquiteturais

1. **Dark-only theme**: Removido suporte a light mode. Todas as classes `dark:` substituídas por valores diretos. CSS variables para consistência.

2. **Stats server-side**: Contadores da hero section são buscados no servidor (page.tsx é async server component com `force-dynamic`), não via fetch client-side, para garantir dados consistentes.

3. **Tecnologias por texto**: Substituído sistema de checkboxes por input de texto (vírgula-separado). Techs inexistentes são criadas automaticamente via API.

4. **Views removidas**: viewsCount não é mais exibido nem incrementado. Simplifica o fluxo e reduz queries.

5. **Prisma mantido**: Decisão de manter Prisma + NextAuth nesta fase. Migração para Supabase Auth + JS Client planejada para fase futura (sistema IBA da igreja).

---

## Problemas Encontrados e Soluções

| Problema | Causa | Solução |
|----------|-------|---------|
| `Export Github/Linkedin doesn't exist` | lucide-react v1.7 não tem ícones de marcas | Substituído por Code2 e ExternalLink |
| Seed falha com "Tenant or user not found" | DATABASE_URL com pooler não funcionava | Usado DIRECT_URL para seed, depois atualizado DATABASE_URL |
| Login 401 Unauthorized | DATABASE_URL incorreta no .env | Corrigido para URL direta (porta 5432) |
| Build Vercel falha "Prisma auto-generation" | Vercel cacheia node_modules sem rodar generate | Adicionado `postinstall: "prisma generate"` |
| Contadores instáveis (0) | Fetch client-side falhava com cold start Supabase | Migrado para server-side fetch via projectService |
| Supabase "Can't reach database" | Projeto pausado ou região mudou após restauração | Atualizar connection string do dashboard |
| Zod "Too big: <=500 characters" | Descrição > 500 chars | Aumentado limite para 2000 |

---

## Plano Futuro (Sistema IBA)

Fases planejadas para transformar o portfólio em sistema de gestão eclesiástica:

1. **Migração Auth**: NextAuth → Supabase Auth (necessário para RLS)
2. **Migração Data**: Prisma → Supabase JS Client (necessário para RLS)
3. **Schema IBA**: profiles, ebd_classes, ebd_enrollments, ebd_attendance, music_courses, music_enrollments, announcements, gallery
4. **RLS**: Hierarquia Pastor > Admin > Professor > Membro > Convidado
5. **Módulos**: EBD, Música (pricing membro vs convidado), Comunicados, Galeria
6. **Dashboard**: Analytics cross-module, gestão de membros

Detalhes completos no plano em `C:\Users\Erich\.claude\plans\immutable-spinning-sunbeam.md`.
