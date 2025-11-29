export interface User {
  id: string;
  email: string;
  password_hash: string;
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

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TaskUpdateRequest {
  text?: string;
  turn?: 'morning' | 'day' | 'afternoon' | 'night';
  min_phase?: number;
  max_phase?: number | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface TaskCreateRequest {
  task_key: string;
  text: string;
  turn: 'morning' | 'day' | 'afternoon' | 'night';
  min_phase: number;
  max_phase?: number | null;
  sort_order?: number;
}
