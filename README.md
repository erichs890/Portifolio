# Portfólio Profissional - Sistema Fullstack Completo

Um sistema moderno e escalável de portfólio pessoal com painel administrativo completo, desenvolvido com as tecnologias mais avançadas do mercado.

## 🚀 Características

### Área Pública
- ✅ Grid responsivo de projetos com design minimalista
- ✅ Páginas de detalhes com renderização Markdown
- ✅ Filtros por tecnologias
- ✅ Busca dinâmica
- ✅ Badges de status (em produção, em desenvolvimento, finalizado)
- ✅ Destaque visual para projetos featured
- ✅ Galeria/carrossel de imagens
- ✅ Links para repositório e deploy
- ✅ SEO otimizado com metadata dinâmica e Open Graph
- ✅ Dark mode por padrão
- ✅ Animações suaves
- ✅ Performance otimizada com Server Components
- ✅ Lazy loading de imagens

### Área Administrativa
- ✅ Autenticação segura com NextAuth.js (JWT)
- ✅ Proteção de rotas com middleware
- ✅ Dashboard com estatísticas
- ✅ CRUD completo de projetos
- ✅ Upload de imagens para Cloudinary
- ✅ Gerenciamento de tecnologias
- ✅ Reordenação de projetos
- ✅ Definir projetos como destaque
- ✅ Publicação/despublicação
- ✅ Controle de status
- ✅ Relacionamento many-to-many com tecnologias
- ✅ Contagem de visualizações
- ✅ Formulários validados com Zod
- ✅ Toast notifications
- ✅ Confirmação modal para exclusão
- ✅ Interface tipo SaaS com sidebar

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15+ (App Router, Server Components)
- **Linguagem**: TypeScript (tipagem forte em toda aplicação)
- **Styling**: Tailwind CSS + Dark Mode
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js v5 com JWT
- **Validação**: Zod
- **Storage**: Cloudinary
- **Hashing**: bcryptjs para hash de senha
- **UI**: React Hot Toast para notificações
- **Markdown**: React Markdown

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- Conta Cloudinary (para uploads de imagem)

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositório>
cd portifolio
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas configurações:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere com: openssl rand -base64 32"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="seu_cloud_name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="seu_upload_preset"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 4. Configure o banco de dados

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Execute a aplicação

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📝 Scripts

```bash
npm run dev              # Desenvolvimento
npm run build            # Build de produção
npm start                # Iniciar servidor
npm run lint             # Linting
npm run prisma:seed      # Seed do banco
npm run prisma:studio    # Prisma Studio
```

## 🔐 Credenciais Padrão

- **Email**: admin@portifolio.com
- **Senha**: admin123

## 📁 Estrutura

```
src/
├── app/               # Next.js App Router
├── components/        # Componentes reutilizáveis
├── lib/              # Utilitários (auth, prisma)
├── middleware.ts     # Proteção de rotas
├── repositories/     # Data access layer
├── services/         # Lógica de negócio
├── types/            # Tipos TypeScript
└── utils/            # Funções auxiliares
```

## 🚀 Deploy na Vercel

1. Push seu código
2. Conecte ao Vercel
3. Configure variáveis de ambiente
4. Deploy automático

## 📄 Licença

MIT - Livre para usar em projetos pessoais e comerciais

---

**Desenvolvido com ❤️ usando Next.js + TypeScript + Tailwind CSS**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
