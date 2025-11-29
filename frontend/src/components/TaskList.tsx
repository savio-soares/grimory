import { Check, RefreshCcw } from 'lucide-react';
import type { Task } from '../types';
import { TURN_NAMES } from '../types';

interface TaskListProps {
  tasks: Task[];
  checks: Record<string, boolean>;
  onToggle: (taskId: string) => void;
}

export function TaskList({ tasks, checks, onToggle }: TaskListProps) {
  // Agrupar por turno
  const tasksByTurn = tasks.reduce((acc, task) => {
    if (!acc[task.turn]) {
      acc[task.turn] = [];
    }
    acc[task.turn].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const turnOrder = ['morning', 'day', 'afternoon', 'night'];
  const availableTurns = turnOrder.filter(turn => tasksByTurn[turn]?.length > 0);

  return (
    <div className="space-y-4 pb-20">
      {availableTurns.map((turn, index) => (
        <div key={turn}>
          {/* Reset Point entre turnos */}
          {index > 0 && (
            <div className="reset-line">
              <RefreshCcw className="w-3 h-3 mr-2" />
              Reset Point (Zerar Culpa)
            </div>
          )}

          {/* Card do Turno */}
          <div className="mystic-card p-4 rounded-lg">
            <h4 className="text-amber-600 cinzel text-sm border-b border-gray-800 pb-2 mb-3 uppercase tracking-widest">
              {TURN_NAMES[turn]}
            </h4>

            <div className="space-y-3">
              {tasksByTurn[turn]
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((task) => (
                  <label
                    key={task.id}
                    className="checkbox-container flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checks[task.id] || false}
                      onChange={() => onToggle(task.id)}
                    />
                    <div className="w-5 h-5 border border-gray-600 rounded bg-gray-900/50 flex items-center justify-center transition-all duration-300 group-hover:border-amber-500 shrink-0">
                      <Check className="w-3 h-3 text-amber-400 opacity-0 transition-all duration-300 transform scale-50" />
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors select-none">
                      {task.text}
                    </span>
                  </label>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
