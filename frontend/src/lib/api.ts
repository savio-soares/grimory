const API_URL = import.meta.env.PROD ? '/api' : '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('grimory_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('grimory_token', token);
    } else {
      localStorage.removeItem('grimory_token');
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || 'Erro na requisição');
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ token: string; user: unknown }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  async updateUser(data: { savings?: number; current_phase?: string; name?: string }) {
    return this.request('/auth/update', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  logout() {
    this.setToken(null);
  }

  // Tasks
  async getTasks(phase?: number) {
    const query = phase ? `?phase=${phase}` : '';
    return this.request(`/tasks${query}`);
  }

  async getAllTasks() {
    return this.request('/tasks/all');
  }

  async createTask(data: {
    task_key: string;
    text: string;
    turn: string;
    min_phase: number;
    max_phase?: number | null;
    sort_order?: number;
  }) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(id: string, data: {
    text?: string;
    turn?: string;
    min_phase?: number;
    max_phase?: number | null;
    sort_order?: number;
    is_active?: boolean;
  }) {
    return this.request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Checks
  async getChecks(date: string) {
    return this.request(`/checks/${date}`);
  }

  async toggleCheck(task_id: string, date: string, is_completed?: boolean) {
    return this.request('/checks/toggle', {
      method: 'POST',
      body: JSON.stringify({ task_id, date, is_completed }),
    });
  }

  // History
  async getHistory(year?: number, month?: number) {
    const params = new URLSearchParams();
    if (year) params.set('year', year.toString());
    if (month) params.set('month', month.toString());
    const query = params.toString() ? `?${params}` : '';
    return this.request(`/history${query}`);
  }

  async saveHistory(date: string, completion_percent: number, phase: string) {
    return this.request('/history', {
      method: 'POST',
      body: JSON.stringify({ date, completion_percent, phase }),
    });
  }

  // Journals
  async getJournals() {
    return this.request('/journals');
  }

  async getCurrentJournal() {
    return this.request('/journals/current');
  }

  async saveJournal(content: string, week_start?: string) {
    return this.request('/journals', {
      method: 'POST',
      body: JSON.stringify({ content, week_start }),
    });
  }
}

export const api = new ApiClient();
