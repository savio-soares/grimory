

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BreathingModal({ isOpen, onClose }: BreathingModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/95 transition-opacity duration-500 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center">
        <div className="breathing-circle w-48 h-48 border-4 border-amber-500 rounded-full mx-auto mb-8 shadow-[0_0_50px_rgba(212,175,55,0.3)]" />
        <p className="text-2xl cinzel text-gray-300 mb-8">Inspire... Expire...</p>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white border-b border-transparent hover:border-white transition-all"
        >
          Estou Estável
        </button>
      </div>
    </div>
  );
}

interface EmergencyButtonProps {
  onClick: () => void;
}

export function EmergencyButton({ onClick }: EmergencyButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={onClick}
        className="bg-red-900/80 hover:bg-red-800 text-white p-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-red-500 transition-transform hover:scale-105 group"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="absolute right-full mr-3 top-2 bg-black/90 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-red-900">
          Perda de Controle?
        </span>
      </button>
    </div>
  );
}
