import type { PhaseInfo } from '../types';

interface PhaseHeaderProps {
  phase: PhaseInfo;
}

export function PhaseHeader({ phase }: PhaseHeaderProps) {
  return (
    <div className="mystic-card p-4 mb-6 rounded-lg bg-black/40 border-l-4 border-amber-600">
      <h3 className="text-amber-500 font-bold cinzel text-lg">{phase.title}</h3>
      <p className="text-sm text-gray-400 italic mt-1">{phase.desc}</p>
    </div>
  );
}
