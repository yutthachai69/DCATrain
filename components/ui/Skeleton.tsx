export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}>
      <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-3 h-6 w-32 rounded bg-slate-200 dark:bg-slate-700" />
    </div>
  );
}

export function SkeletonChart({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}>
      <div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-2 h-3 w-64 rounded bg-slate-200 dark:bg-slate-700" />
      <div className="mt-5 h-[300px] rounded-xl bg-slate-100 dark:bg-slate-700/50" />
    </div>
  );
}

export function SkeletonLine({ width = 'w-full' }: { width?: string }) {
  return <div className={`animate-pulse h-3 rounded bg-slate-200 dark:bg-slate-700 ${width}`} />;
}
