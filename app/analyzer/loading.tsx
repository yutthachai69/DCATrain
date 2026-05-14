import { SkeletonCard, SkeletonChart } from '@/components/ui/Skeleton';

export default function AnalyzerLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="animate-pulse rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/85">
          <div className="h-3 w-24 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-7 w-60 rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-3 w-80 rounded bg-slate-200 dark:bg-slate-700" />
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <SkeletonChart />
      </div>
    </main>
  );
}
