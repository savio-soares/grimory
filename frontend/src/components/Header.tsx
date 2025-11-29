import { Coins } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { user, updateUser } = useAuth();
  const [savings, setSavings] = useState(user?.savings?.toString() || '');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setSavings(user?.savings?.toString() || '');
  }, [user?.savings]);

  const handleSavingsChange = async (value: string) => {
    setSavings(value);
  };

  const handleSavingsBlur = async () => {
    setIsEditing(false);
    const numValue = parseFloat(savings) || 0;
    if (numValue !== user?.savings) {
      await updateUser({ savings: numValue });
    }
  };

  return (
    <header className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-100 cinzel">
          Guardian's Grimoire
        </h1>
        <p className="text-xs text-amber-500 tracking-widest uppercase">
          Evolution Protocol
        </p>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">
          Accumulated Mana
        </div>
        <div className="flex items-center justify-end gap-2 text-xl font-mono text-gold">
          <Coins className="w-4 h-4 text-yellow-500" />
          {isEditing ? (
            <input
              type="number"
              value={savings}
              onChange={(e) => handleSavingsChange(e.target.value)}
              onBlur={handleSavingsBlur}
              autoFocus
              className="bg-transparent text-right w-24 focus:outline-none border-b border-amber-600"
              placeholder="0"
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              className="cursor-pointer hover:text-amber-400 transition-colors min-w-[60px] text-right"
            >
              $ {parseFloat(savings || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
