# Guia de Deploy na Vercel

## Pré-requisitos

- Repositório GitHub com seu código
- Conta na Vercel ([vercel.com](https://vercel.com))
- Banco PostgreSQL (Neon, Supabase, Railway ou outro provider)

## Passo 1: Preparar o Repositório

```bash
# Comitar todas as mudanças
git add .
git commit -m "chore: initial portfolio project setup"
git push origin main
```

## Passo 2: Deploy na Vercel

### Via Dashboard (Recomendado)

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Selecione seu repositório
3. Configure o projeto:
   - **Framework**: Next.js
   - **Root Directory**: ./

### Via CLI

```bash
npm install -g vercel
vercel
```

## Passo 3: Configurar Variáveis de Ambiente

Na Vercel, acesse **Settings > Environment Variables** e adicione:

```
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=<gere com: openssl rand -base64 32>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=seu_upload_preset
NEXT_PUBLIC_API_URL=https://seu-dominio.vercel.app
```

## Passo 4: Setup do Banco de Dados

### Opção 1: Supabase (Recomendado)

1. Crie uma conta em [supabase.com](https://supabase.com)
2. Crie um novo projeto PostgreSQL
3. Copie a connection string em **Project Settings > Database**
4. Use como `DATABASE_URL`

### Opção 2: Railway

1. Crie conta em [railway.app](https://railway.app)
2. Crie um novo projeto PostgreSQL
3. Copie a connection string
4. Use como `DATABASE_URL`

### Opção 3: Neon

1. Crie conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto
3. Copie a connection string
4. Use como `DATABASE_URL`

## Passo 5: Executar Migrations

Após configurar o banco, execute as migrations:

```bash
# Localmente, após vincular ao banco de produção
DATABASE_URL="sua-connection-string" npx prisma migrate deploy
DATABASE_URL="sua-connection-string" npx prisma db seed
```

Ou use um hook de build da Vercel:

**Settings > Build & Development Settings > Build Command:**

```
npx prisma migrate deploy && next build
```

## Passo 6: Deploy Final

```bash
git add .
git commit -m "Deploy para produção"
git push origin main
```

A Vercel fará o deploy automaticamente.

## Passo 7: Configurar Domínio Customizado (Opcional)

1. Na Vercel, acesse **Settings > Domains**
2. Adicione seu domínio
3. Configure os registros DNS conforme instruído

## Checklist Final

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados funcionando
- [ ] Migrations executadas
- [ ] Seed de dados executado
- [ ] Site acessível em produção
- [ ] Login funcionando com credenciais padrão
- [ ] Uploads de imagem funcionando
- [ ] Dark mode funcionando
- [ ] SEO metadata carregando corretamente
- [ ] Performance otimizada

## Troubleshooting

### Erro: "Connection timeout"
- Verifique a CONNECTION STRING
- Certifique-se de que o IP está na whitelist do banco

### Erro: "Prisma migration failed"
- Verifique se o schema.prisma está correto
- Tente recriar as migrations: `prisma migrate reset`

### Imagens não carregam
- Verifique credenciais Cloudinary
- Teste o upload manualmente

### Autenticação não funciona
- Regenere NEXTAUTH_SECRET: `openssl rand -base64 32`
- Verifique NEXTAUTH_URL está correto (com protocolo https)

## Monitoramento

### Observar logs em produção

```bash
vercel logs
```

### Analytics

Acesse **Analytics** na dashboard da Vercel para ver:
- Performance metrics
- Traffic patterns
- Error rates

## Atualizações Futuras

Para fazer deploy de atualizações:

```bash
# Desenvolver localmente
npm run dev

# Testar
npm run build

# Comitar e fazer push
git add .
git commit -m "feature: descrição da mudança"
git push origin main

# Vercel faz deploy automaticamente
```

## Rollback

Se algo der errado:

1. Acesse Vercel Dashboard
2. Vá para **Deployments**
3. Clique em um deploy anterior
4. Clique em **Promote to Production**

---

**Sucesso no deploy! 🚀**
