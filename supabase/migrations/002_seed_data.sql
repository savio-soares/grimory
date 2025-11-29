-- =============================================
-- SEED DATA: Usuário inicial + Tarefas padrão
-- =============================================

-- Inserir usuário principal
-- Senha: 8123Sav* (hash bcrypt)
INSERT INTO users (id, email, password_hash, name, savings, current_phase)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'savisoares@gmail.com',
    '$2b$10$yqrsaqMnRfmihpvezQGMPOdZaWbGuL64KlmMY1mKwf.nEdRZT6hra',
    'Savio Soares',
    0.00,
    'month1'
) ON CONFLICT (email) DO NOTHING;

-- =============================================
-- TAREFAS PADRÃO DO ACTING METHOD
-- =============================================

-- MANHÃ - Turno do Despertar
INSERT INTO tasks (user_id, task_key, text, turn, min_phase, max_phase, sort_order) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'm_sun', 'Luz Solar Imediata (Reset Ciclo)', 'morning', 1, NULL, 1),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'm_meditate', 'Meditação do Observador (5min)', 'morning', 1, NULL, 2),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'm_water', 'Água Gelada (Choque Térmico)', 'morning', 1, NULL, 3),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'm_bed', 'Arrumar Cama (Ordem Mínima)', 'morning', 2, NULL, 4)
ON CONFLICT (user_id, task_key) DO NOTHING;

-- DIA - Turno da Missão
INSERT INTO tasks (user_id, task_key, text, turn, min_phase, max_phase, sort_order) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd_task', 'Tarefas Essenciais (Trabalho)', 'day', 1, NULL, 1),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd_lunch', 'Almoço: Comer Marmita Própria', 'day', 3, NULL, 2),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd_reset', 'Reset Point Pós-Almoço (Respiração)', 'day', 1, NULL, 3)
ON CONFLICT (user_id, task_key) DO NOTHING;

-- TARDE - Turno do Retorno
INSERT INTO tasks (user_id, task_key, text, turn, min_phase, max_phase, sort_order) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a_gym_light', 'Vestir Roupa de Treino (Só vestir conta)', 'afternoon', 1, 2, 1),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a_gym_hard', 'Missão Caçador (Treino Intenso)', 'afternoon', 3, NULL, 2),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a_shower', 'Ritual de Purificação (Banho Consciente)', 'afternoon', 2, NULL, 3),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a_clean_2min', 'Regra dos 2 Minutos (Limpeza Rápida)', 'afternoon', 2, NULL, 4)
ON CONFLICT (user_id, task_key) DO NOTHING;

-- NOITE - Turno do Santuário
INSERT INTO tasks (user_id, task_key, text, turn, min_phase, max_phase, sort_order) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'n_sink', 'Pia Limpa (Ambiente Sacro)', 'night', 2, NULL, 1),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'n_prep', 'Preparar Roupa/Mesa p/ Amanhã', 'night', 1, NULL, 2),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'n_read', 'Recompensa: Lord of Mysteries', 'night', 1, NULL, 3),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'n_screens', 'Blackout Digital (1h antes dormir)', 'night', 1, NULL, 4)
ON CONFLICT (user_id, task_key) DO NOTHING;
