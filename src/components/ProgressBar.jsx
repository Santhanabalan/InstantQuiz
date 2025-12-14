export const ProgressBar = ({ current, total, currentIndex }) => {
  const percentage = Math.round((current / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-gray-300 mb-2">
        <span>{current} / {total} answered</span>
        <span>{percentage}% complete</span>
      </div>
      <div className="w-full h-2 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
