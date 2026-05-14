'use client';

type Props<T extends string> = {
  title: string;
  description?: string;
  items: T[];
  value: T;
  onChange: (value: T) => void;
};

export default function ChipGroup<T extends string>({ title, description, items, value, onChange }: Props<T>) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/50">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</p>
      {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-full border px-4 py-2 text-sm transition ${value === item ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-950 dark:text-cyan-400' : 'border-slate-300 bg-white text-slate-700 hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-600'}`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
