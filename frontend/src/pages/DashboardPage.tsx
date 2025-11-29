import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { ParticleBackground } from '../components/ParticleBackground';
import { Header } from '../components/Header';
import { Navigation } from '../components/Navigation';
import { PhaseHeader } from '../components/PhaseHeader';
import { ProgressBar } from '../components/ProgressBar';
import { TaskList } from '../components/TaskList';
import { CalendarView } from '../components/CalendarView';
import { BreathingModal, EmergencyButton } from '../components/BreathingModal';
import type { Task, DailyHistory, TabType } from '../types';
import { PHASE_INFO } from '../types';

export function DashboardPage() {
  const { user, logout, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>(
    (user?.current_phase as TabType) || 'month1'
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<DailyHistory[]>([]);
  const [progress, setProgress] = useState(0);
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getTodayKey = () => new Date().toISOString().split('T')[0];

  const getPhaseLevel = (phase: string) => {
    return PHASE_INFO[phase]?.level || 1;
  };

  // Carregar tarefas
  const loadTasks = useCallback(async (phase: string) => {
    try {
      const level = getPhaseLevel(phase);
      const data = await api.getTasks(level) as Task[];
      setTasks(data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }, []);

  // Carregar checks do dia
  const loadChecks = useCallback(async () => {
    try {
      const today = getTodayKey();
      const data = await api.getChecks(today) as { task_id: string; is_completed: boolean }[];
      const checksMap = data.reduce((acc, check) => {
        if (check.is_completed) {
          acc[check.task_id] = true;
        }
        return acc;
      }, {} as Record<string, boolean>);
      setChecks(checksMap);
    } catch (error) {
      console.error('Erro ao carregar checks:', error);
    }
  }, []);

  // Carregar histórico
  const loadHistory = useCallback(async () => {
    try {
      const data = await api.getHistory() as DailyHistory[];
      setHistory(data);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  }, []);

  // Calcular e salvar progresso
  const calculateProgress = useCallback(() => {
    if (tasks.length === 0) {
      setProgress(0);
      return;
    }
    
    const completed = Object.values(checks).filter(Boolean).length;
    const percent = Math.round((completed / tasks.length) * 100);
    setProgress(percent);

    // Salvar histórico
    const today = getTodayKey();
    api.saveHistory(today, percent, activeTab).catch(console.error);
  }, [tasks, checks, activeTab]);

  // Efeitos
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await Promise.all([
        loadTasks(activeTab),
        loadChecks(),
        loadHistory(),
      ]);
      setIsLoading(false);
    };
    
    if (activeTab !== 'calendar') {
      init();
    } else {
      loadHistory();
      setIsLoading(false);
    }
  }, [activeTab, loadTasks, loadChecks, loadHistory]);

  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  // Handlers
  const handleTabChange = async (tab: TabType) => {
    setActiveTab(tab);
    if (tab !== 'calendar') {
      await updateUser({ current_phase: tab });
    }
  };

  const handleToggleTask = async (taskId: string) => {
    const today = getTodayKey();
    const newValue = !checks[taskId];
    
    // Otimistic update
    setChecks(prev => ({
      ...prev,
      [taskId]: newValue,
    }));

    try {
      await api.toggleCheck(taskId, today, newValue);
    } catch (error) {
      // Reverter em caso de erro
      setChecks(prev => ({
        ...prev,
        [taskId]: !newValue,
      }));
      console.error('Erro ao toggle task:', error);
    }
  };

  const currentPhase = PHASE_INFO[activeTab] || PHASE_INFO.month1;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ParticleBackground progress={0} />
        <div className="text-amber-500 text-xl cinzel animate-pulse">
          Carregando Grimório...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-200 pb-20">
      <ParticleBackground progress={progress} />
      
      <div className="relative z-10 container mx-auto px-4 py-6 max-w-3xl">
        {/* Header com ações */}
        <div className="flex justify-end gap-2 mb-4">
          <Link
            to="/tasks"
            className="p-2 text-gray-500 hover:text-amber-500 transition-colors"
            title="Editar Tarefas"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <button
            onClick={logout}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <Header />
        
        <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

        {activeTab !== 'calendar' ? (
          <div className="animate-fade-in">
            <PhaseHeader phase={currentPhase} />
            <ProgressBar percent={progress} />
            <TaskList
              tasks={tasks}
              checks={checks}
              onToggle={handleToggleTask}
            />
          </div>
        ) : (
          <CalendarView history={history} />
        )}
      </div>

      <EmergencyButton onClick={() => setIsBreathingOpen(true)} />
      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />
    </div>
  );
}
