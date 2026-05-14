'use client';

type Props = {
  allocation: Array<{ label: string; percent: number; color: string }>;
};

export default function AllocationChart({ allocation }: Props) {
  return (
    <div className="rounded-2xl border border-stone-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 p-4">
      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">สัดส่วนพอร์ต</p>
      <div className="mt-4 space-y-3">
        {allocation.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>{item.label}</span>
              <span>{item.percent}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-600">
              <div className="h-2 rounded-full" style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
