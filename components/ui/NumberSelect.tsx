'use client';

type Props = {
  title: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  options: Array<{ label: string; value: number }>;
};

export default function NumberSelect({ title, description, value, onChange, options }: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</p>
      {description && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      <select
        className="mt-3 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-800 dark:text-slate-200 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
