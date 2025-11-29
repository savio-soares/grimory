import { useState, useEffect } from 'react';
import type { DailyHistory, Journal } from '../types';
import { api } from '../lib/api';

interface CalendarViewProps {
  history: DailyHistory[];
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function CalendarView({ history }: CalendarViewProps) {
  const [journal, setJournal] = useState('');
  const [journals, setJournals] = useState<Journal[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Criar mapa de histórico
  const historyMap = history.reduce((acc, h) => {
    acc[h.history_date] = h.completion_percent;
    return acc;
  }, {} as Record<string, number>);

  const getTodayKey = () => {
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    loadJournals();
    loadCurrentJournal();
  }, []);

  const loadJournals = async () => {
    try {
      const data = await api.getJournals() as Journal[];
      setJournals(data);
    } catch (error) {
      console.error('Erro ao carregar journals:', error);
    }
  };

  const loadCurrentJournal = async () => {
    try {
      const data = await api.getCurrentJournal() as Journal;
      setJournal(data?.content || '');
    } catch (error) {
      console.error('Erro ao carregar journal atual:', error);
    }
  };

  const handleJournalChange = async (content: string) => {
    setJournal(content);
  };

  const handleJournalSave = async () => {
    try {
      await api.saveJournal(journal);
      loadJournals();
    } catch (error) {
      console.error('Erro ao salvar journal:', error);
    }
  };

  const getDayClass = (dayKey: string) => {
    const score = historyMap[dayKey];
    if (score === undefined) return 'day-neutral text-gray-600';
    if (score >= 80) return 'day-gold font-bold';
    if (score >= 40) return 'day-neutral text-gray-300';
    return 'day-crimson';
  };

  const formatWeek = (weekStart: string, weekEnd: string) => {
    const start = new Date(weekStart + 'T00:00:00');
    const end = new Date(weekEnd + 'T00:00:00');
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  };

  return (
    <div className="mystic-card p-6 rounded-xl animate-fade-in">
      {/* Header do Calendário */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl cinzel text-gray-200">{MONTH_NAMES[month]}</h2>
        <div className="flex gap-2 text-xs">
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-900/40 border border-amber-500"></div> Digerido
          </span>
          <span className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-900/40 border border-red-800"></div> Falha
          </span>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-xs text-gray-500 pb-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Espaços vazios */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Dias do mês */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dayKey === getTodayKey();
          const score = historyMap[dayKey];

          return (
            <div
              key={dayKey}
              className={`calendar-day rounded ${getDayClass(dayKey)} ${isToday ? 'ring-2 ring-white' : ''}`}
            >
              {day}
              {score !== undefined && (
                <div className="absolute bottom-0.5 right-0.5 text-[8px] opacity-50">
                  {score}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Journal da Semana Atual */}
      <div className="mt-8 border-t border-gray-800 pt-4">
        <h3 className="cinzel text-amber-600 mb-2 text-center">
          Análise Semanal (Reality Anchor)
        </h3>
        <textarea
          value={journal}
          onChange={(e) => handleJournalChange(e.target.value)}
          onBlur={handleJournalSave}
          placeholder="Onde eu perdi o controle? Onde eu venci? Escreva brevemente..."
          className="w-full bg-black/30 border border-gray-700 rounded p-3 text-sm text-gray-300 focus:border-amber-500 outline-none h-32 resize-none"
        />
      </div>

      {/* Journals Anteriores */}
      {journals.length > 0 && (
        <div className="mt-6 border-t border-gray-800 pt-4">
          <h3 className="cinzel text-gray-400 mb-3 text-sm">Reflexões Anteriores</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {journals.map((j) => (
              <button
                key={j.id}
                onClick={() => setSelectedJournal(selectedJournal?.id === j.id ? null : j)}
                className="w-full text-left p-2 bg-gray-900/50 rounded border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-amber-600">
                    Semana: {formatWeek(j.week_start, j.week_end)}
                  </span>
                </div>
                {selectedJournal?.id === j.id && j.content && (
                  <p className="text-xs text-gray-400 mt-2 whitespace-pre-wrap">
                    {j.content}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
