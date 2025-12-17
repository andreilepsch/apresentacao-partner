# Autoridade Investimentos - Consultoria Premium em Consórcio

## Sobre o Projeto

Plataforma de consultoria premium em consórcio com apresentações interativas e ferramentas de análise.

## Tecnologias

Este projeto é construído com:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Self-hosted)

## Configuração

### 1. Instalar dependências

```sh
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://supabase-apresentacao-partner.cgbrasil.com.br:8000
VITE_SUPABASE_PUBLISHABLE_KEY=sua_anon_key_aqui
```

### 3. Rodar o projeto

```sh
npm run dev
```

## Migrações do Banco de Dados

As migrações estão em `supabase/migrations/`. Para aplicar:

1. Acesse o Supabase Studio
2. Vá em SQL Editor
3. Execute cada arquivo de migração em ordem cronológica

## Domínio de Email

O sistema aceita apenas emails com domínio `@autoridadeinvestimentos.com.br`.
