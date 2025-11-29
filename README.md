# Guardian's Grimoire 🔮

A habit tracking system based on the "Acting Method" inspired by Lord of Mysteries.

## 🚀 Quick Deploy (Railway)

### 1. Prepare Supabase
Run the SQL scripts in Supabase Dashboard (SQL Editor):
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_seed_data.sql`

### 2. Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub
3. Select this repository
4. Configure environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
JWT_SECRET=a_strong_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3001
```

5. Deploy! 🎉

### 3. Configure Domain
In Railway → Settings → Domains → Add Custom Domain

---

## 🛠 Local Development

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

Access: http://localhost:5173

---

## 📁 Structure

```
grimory/
├── frontend/     # React + TypeScript + Tailwind
├── backend/      # Node.js + Express + TypeScript
└── supabase/     # SQL Migrations
```

## 🎮 The Acting Method

This system is based on a 3-month progressive habit building protocol:

### Month 1: The Foundation (The Observer)
- Focus on sleep regulation and mental anchoring
- Morning meditation is mandatory
- Everything else is optional

### Month 2: The Territory (The Caretaker)
- Environment reflects the mind
- Add hygiene and light cleaning habits
- "Clean sink is law"

### Month 3: The Vessel (The Hunter)
- Physical intensity and dietary control
- Full workout routines
- Sunday meal prep

## 🔐 Default Credentials
- Email: savisoares@gmail.com
- Password: 8123Sav*

## ✨ Features
- 🌙 Dark mystical theme with particle effects
- 📊 Daily task tracking by time of day (turns)
- 📅 Calendar view with completion history
- 📝 Weekly journal for reflection
- 💰 Savings tracker ("Accumulated Mana")
- 🧘 Emergency breathing exercise modal
- ⚙️ Customizable tasks per phase
