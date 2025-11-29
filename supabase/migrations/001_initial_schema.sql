-- =============================================
-- GRIMÓRIO DO GUARDIÃO - Schema Inicial
-- =============================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABELA: users (perfil do usuário)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    savings DECIMAL(10, 2) DEFAULT 0.00,
    current_phase VARCHAR(20) DEFAULT 'month1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- TABELA: tasks (tarefas customizáveis)
-- =============================================
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_key VARCHAR(50) NOT NULL,
    text VARCHAR(500) NOT NULL,
    turn VARCHAR(20) NOT NULL CHECK (turn IN ('morning', 'day', 'afternoon', 'night')),
    min_phase INTEGER NOT NULL DEFAULT 1 CHECK (min_phase >= 1 AND min_phase <= 3),
    max_phase INTEGER CHECK (max_phase IS NULL OR (max_phase >= 1 AND max_phase <= 3)),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, task_key)
);

-- =============================================
-- TABELA: daily_checks (marcações diárias)
-- =============================================
CREATE TABLE IF NOT EXISTS daily_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    check_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, task_id, check_date)
);

-- =============================================
-- TABELA: daily_history (histórico de % por dia)
-- =============================================
CREATE TABLE IF NOT EXISTS daily_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    history_date DATE NOT NULL,
    completion_percent INTEGER DEFAULT 0 CHECK (completion_percent >= 0 AND completion_percent <= 100),
    phase VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, history_date)
);

-- =============================================
-- TABELA: journals (reflexões semanais)
-- =============================================
CREATE TABLE IF NOT EXISTS journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    week_end DATE NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_start)
);

-- =============================================
-- ÍNDICES para performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_turn ON tasks(turn);
CREATE INDEX IF NOT EXISTS idx_daily_checks_user_date ON daily_checks(user_id, check_date);
CREATE INDEX IF NOT EXISTS idx_daily_history_user_date ON daily_history(user_id, history_date);
CREATE INDEX IF NOT EXISTS idx_journals_user_week ON journals(user_id, week_start);

-- =============================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_history_updated_at BEFORE UPDATE ON daily_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON journals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- RLS (Row Level Security) - Segurança
-- =============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;

-- Políticas: cada usuário só vê seus próprios dados
CREATE POLICY "Users can view own data" ON users FOR ALL USING (true);
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Users can manage own checks" ON daily_checks FOR ALL USING (true);
CREATE POLICY "Users can manage own history" ON daily_history FOR ALL USING (true);
CREATE POLICY "Users can manage own journals" ON journals FOR ALL USING (true);
