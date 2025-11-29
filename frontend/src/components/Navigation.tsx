import { Calendar } from 'lucide-react';
import type { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs: { id: TabType; label: string; number?: string }[] = [
    { id: 'month1', label: 'Fundação', number: 'I' },
    { id: 'month2', label: 'Território', number: 'II' },
    { id: 'month3', label: 'Caçador', number: 'III' },
    { id: 'calendar', label: 'Histórico' },
  ];

  return (
    <nav className="grid grid-cols-4 gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`mystic-card py-3 px-1 rounded-lg text-center text-xs md:text-sm font-bold uppercase transition-all ${
            activeTab === tab.id ? 'active-tab' : 'inactive-tab'
          }`}
        >
          {tab.number ? (
            <span className="block text-xl mb-1">{tab.number}</span>
          ) : (
            <Calendar className="mx-auto mb-1 w-5 h-5" />
          )}
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
