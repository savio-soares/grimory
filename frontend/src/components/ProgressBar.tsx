interface ProgressBarProps {
  percent: number;
}

export function ProgressBar({ percent }: ProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between text-xs uppercase tracking-widest mb-1 text-gray-500">
        <span>Sincronia Diária</span>
        <span>{percent}%</span>
      </div>
      <div className="w-full bg-gray-900 rounded-full h-2">
        <div
          className="bg-amber-700 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
