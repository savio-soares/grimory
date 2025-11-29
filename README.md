# Grimório do Guardião 🔮

Sistema de acompanhamento de hábitos baseado no "Acting Method" inspirado em Lord of Mysteries.

## 🚀 Deploy Rápido (Railway)

### 1. Preparar Supabase
Execute os scripts SQL no Supabase Dashboard (SQL Editor):
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_seed_data.sql`

### 2. Deploy no Railway
1. Acesse [railway.app](https://railway.app)
2. Conecte seu GitHub
3. Selecione este repositório
4. Configure as variáveis de ambiente:

```env
SUPABASE_URL=sua_url_supabase
SUPABASE_ANON_KEY=sua_chave_supabase
JWT_SECRET=uma_chave_secreta_forte_aqui
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
```

5. Deploy! 🎉

### 3. Configurar Domínio
No Railway → Settings → Domains → Add Custom Domain

---

## 🛠 Desenvolvimento Local

```bash
# Backend (terminal 1)
cd backend
npm install
npm run dev

# Frontend (terminal 2)
cd frontend
npm install
npm run dev
```

Acesse: http://localhost:5173

---

## 📁 Estrutura

```
grimory/
├── frontend/     # React + TypeScript + Tailwind
├── backend/      # Node.js + Express + TypeScript
└── supabase/     # Migrations SQL
```

## 🔐 Credenciais padrão
- Email: savisoares@gmail.com
- Senha: 8123Sav*