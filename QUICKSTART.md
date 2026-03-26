# 🚀 Guia de Início Rápido

## ✅ Checklist de Setup

- [x] Dependências instaladas
- [x] Prisma configurado
- [x] Tipos TypeScript gerados
- [ ] Banco de dados PostgreSQL rodando
- [ ] Migrations executadas
- [ ] Seed de dados carregado
- [ ] Desenvolvimento iniciado

## 📝 Próximos Passos

### 1. Configurar Banco de Dados

Você tem 3 opções:

#### Opção A: PostgreSQL Local

```bash
# Windows (usando WSL recomendado)
wsl
sudo apt-get install postgresql
sudo service postgresql start

# Criar banco de dados
sudo -u postgres psql
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'password';
ALTER ROLE portfolio_user SET client_encoding TO 'utf8';
ALTER ROLE portfolio_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE portfolio_user SET default_transaction_deferrable TO on;
ALTER ROLE portfolio_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
\q
```

#### Opção B: Docker (Recomendado)

```bash
docker run --name portfolio-db \
  -e POSTGRES_USER=portfolio_user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=portfolio_db \
  -p 5432:5432 \
  -d postgres:15 \
  -c max_connections=200
```

#### Opção C: Nube (Rápido)

1. Supabase.com, Railway.app ou Neon.tech
2. Copie a connection string
3. Use como variável DATABASE_URL

### 2. Atualizar .env.local

```bash
# Exemplo completo
DATABASE_URL="postgresql://portfolio_user:password@localhost:5432/portfolio_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-com-openssl-rand-base64-32"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="dh7e4f3a6"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="portifolio_dev"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Executar Migrations

```bash
# Primeira vez (cria tabelas)
npx prisma migrate dev --name init

# Seed com dados iniciais
npx prisma db seed
```

### 4. Iniciar Desenvolvimento

```bash
npm run dev
```

Acesse:
- 🌐 App: http://localhost:3000
- 🔐 Login: http://localhost:3000/login
- 📊 Admin: http://localhost:3000/admin

**Credenciais padrão:**
- Email: admin@portifolio.com
- Senha: admin123

### 5. Explorar Prisma Studio (Opcional)

```bash
npx prisma studio
```

Abre um UI visual para gerenciar dados no banco.

## 📦 Cloudinary Setup (Para Upload de Imagens)

1. Vá para [cloudinary.com](https://cloudinary.com)
2. Crie uma conta gratuita
3. Dashboard > Settings > API Keys
4. Copie `Cloud Name`
5. Crie um preset de upload:
   - Settings > Upload
   - Add upload preset
   - Name: `portifolio_dev`
   - Signing Mode: `Unsigned`
   - Copie o nome do preset
6. Atualize `.env.local`:
   ```
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=portifolio_dev
   ```

## 🔍 Estrutura do Projeto

```
portifolio/
├── src/
│   ├── app/
│   │   ├── api/                # Routes da API
│   │   ├── admin/              # Dashboard admin
│   │   ├── projects/           # Detalhes dos projetos
│   │   ├── login/              # Página de login
│   │   └── page.tsx            # Página inicial
│   ├── components/             # Componentes reutilizáveis
│   ├── lib/                    # Auth, Prisma, validação
│   ├── services/               # Lógica de negócio
│   ├── repositories/           # Data access
│   ├── middleware.ts           # Proteção de rotas
│   ├── types/                  # Tipos TypeScript
│   └── utils/                  # Funções auxiliares
├── prisma/
│   ├── schema.prisma           # Modelo do banco
│   └── seed.ts                 # Seed inicial
└── public/                     # Arquivos estáticos
```

## 🎯 Fluxo de Desenvolvimento

### Criar Novo Projeto (Como Admin)

1. Acesse http://localhost:3000/admin
2. Clique em "Novo Projeto"
3. Preencha os campos:
   - **Título**: Nome único do projeto
   - **Descrição**: Resumo (max 500 caracteres)
   - **Descrição Longa**: Detalhes em Markdown
   - **URL Repositório**: Link GitHub
   - **URL Deploy**: Link para preview ao vivo
   - **Tecnologias**: Selecione as techs usadas
   - **Status**: Em Desenvolvimento / Produção / Finalizado
4. Upload de imagem via Cloudinary
5. Marcar como "Destaque" se necessário
6. Publicar
7. Salvar

### Visualizar Projetos (Como Visitante)

1. Acesse http://localhost:3000
2. Veja o grid responsivo com todos os projetos publicados
3. Clique em um projeto para ver detalhes
4. Veja imagens, tecnologias, links externos

## 🔐 Segurança em Desenvolvimento

- Senhas são hashadas com bcryptjs
- Tokens JWT são assinados
- Autenticação obrigatória para admin
- Middleware protege rotas sensíveis
- Inputs validados com Zod

## 🐛 Comandos Úteis para Desenvolvimento

```bash
# Iniciar dev server
npm run dev

# Build de produção
npm run build

# Iniciar servidor de produção
npm start

# Linting
npm run lint

# Abrir Prisma Studio
npx prisma studio

# Reset do banco (⚠️ apaga tudo)
npx prisma migrate reset

# Ver migrations
npx prisma migrate status

# Criar nova migration
npx prisma migrate dev --name nome_da_migracao
```

## 📚 Recursos Úteis

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [TypeScript Docs](https://www.typescriptlang.org/docs)

## 🆘 Troubleshooting Comum

### Erro: "DATABASE_URL not set"
- Verifique `.env.local`
- Certifique-se de que existe a variável DATABASE_URL

### Erro: "Connection refused"
- Certifique-se de que PostgreSQL está rodando
- Teste a conexão: `psql $DATABASE_URL`

### Erro: "Migrations pending"
- Execute: `npx prisma migrate dev`

### Login não funciona
- Verifique `NEXTAUTH_SECRET`
- Verifique se db foi seedado
- Limpe cookies do navegador

### Upload de imagens não funciona
- Verifique credenciais Cloudinary
- Teste no Cloudinary dashboard
- Confirm CORS settings

## 🎉 Pronto para Desenvolvimento!

Você agora tem um sistema fullstack profissional de portfólio completamente funcional.

**Happy coding! 🚀**

---

**Dúvidas?** Verifique:
- README.md para visão geral
- DEPLOY.md para deploy em produção
- Código comentado nas pastas `/src`
