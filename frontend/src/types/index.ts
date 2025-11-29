export interface User {
  id: string;
  email: string;
  name: string | null;
  savings: number;
  current_phase: 'month1' | 'month2' | 'month3';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  task_key: string;
  text: string;
  turn: 'morning' | 'day' | 'afternoon' | 'night';
  min_phase: number;
  max_phase: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyCheck {
  id: string;
  user_id: string;
  task_id: string;
  check_date: string;
  is_completed: boolean;
  created_at: string;
  task?: Task;
}

export interface DailyHistory {
  id: string;
  user_id: string;
  history_date: string;
  completion_percent: number;
  phase: string;
  created_at: string;
  updated_at: string;
}

export interface Journal {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export interface PhaseInfo {
  title: string;
  desc: string;
  level: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type TabType = 'month1' | 'month2' | 'month3' | 'calendar';

export const PHASE_INFO: Record<string, PhaseInfo> = {
  month1: {
    title: "Mês 1: A Fundação (O Observador)",
    desc: "Objetivo: Regular o sono e criar a âncora mental. O resto é opcional. Se falhar no treino, tudo bem. Não falhe na meditação.",
    level: 1
  },
  month2: {
    title: "Mês 2: O Território (O Zelador)",
    desc: "Objetivo: O ambiente reflete a mente. Adicionamos higiene e limpeza leve. Pia limpa é lei.",
    level: 2
  },
  month3: {
    title: "Mês 3: O Recipiente (O Caçador)",
    desc: "Objetivo: Intensidade física e controle alimentar. Domingo é dia de Meal Prep.",
    level: 3
  }
};

export const TURN_NAMES: Record<string, string> = {
  morning: 'Turno da Manhã: O Despertar',
  day: 'Turno do Dia: A Missão',
  afternoon: 'Turno da Tarde: O Retorno',
  night: 'Turno da Noite: O Santuário'
};
