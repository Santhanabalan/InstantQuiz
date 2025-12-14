import { AlertCircle, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Timer = ({ startTime, durationMinutes, onTimeUp }) => {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, durationMinutes * 60 - elapsed);
      
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, durationMinutes, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isWarning = timeRemaining <= 300; // 5 minutes

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-semibold ${
        isWarning
          ? 'bg-red-100 text-red-700 border border-red-300'
          : 'bg-slate-100 text-slate-700 border border-slate-300'
      }`}
    >
      {isWarning ? (
        <AlertCircle className="w-5 h-5 animate-pulse" />
      ) : (
        <Clock className="w-5 h-5" />
      )}
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};
