'use client';

type Props = {
  steps: string[];
  current: number;
};

export default function StepIndicator({ steps, current }: Props) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, index) => {
        const isActive = index === current;
        const isDone = index < current;
        return (
          <div key={label} className="flex items-center gap-2">
            {index > 0 && (
              <div className={`h-0.5 w-6 sm:w-10 ${isDone ? 'bg-cyan-500' : 'bg-slate-200 dark:bg-slate-600'}`} />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition ${
                  isActive
                    ? 'bg-cyan-600 text-white'
                    : isDone
                      ? 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-400'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                }`}
              >
                {isDone ? '✓' : index + 1}
              </div>
              <span className={`hidden text-sm sm:inline ${isActive ? 'font-semibold text-cyan-700 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'}`}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
