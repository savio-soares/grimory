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
    title: "Month 1: The Foundation (The Observer)",
    desc: "Goal: Regulate sleep and create the mental anchor. Everything else is optional. If you fail at training, it's okay. Don't fail at meditation.",
    level: 1
  },
  month2: {
    title: "Month 2: The Territory (The Caretaker)",
    desc: "Goal: The environment reflects the mind. We add hygiene and light cleaning. Clean sink is law.",
    level: 2
  },
  month3: {
    title: "Month 3: The Vessel (The Hunter)",
    desc: "Goal: Physical intensity and dietary control. Sunday is Meal Prep day.",
    level: 3
  }
};

export const TURN_NAMES: Record<string, string> = {
  morning: 'Morning Turn: The Awakening',
  day: 'Day Turn: The Mission',
  afternoon: 'Afternoon Turn: The Return',
  night: 'Night Turn: The Sanctuary'
};
