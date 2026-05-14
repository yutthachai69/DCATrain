'use client';

import { formatBaht, formatNumber } from '@/lib/format';

type Props = {
  label: string;
  value: number;
  min: number;
  max?: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
  hint?: string;
};

export default function NumberInput({ label, value, min, max, step, onChange, suffix = '฿', hint }: Props) {
  return (
    <label className="grid gap-3 md:grid-cols-[140px_1fr_120px] md:items-center">
      <div>
        <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
        {hint && <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
      </div>
      <input
        className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-right font-semibold text-ink outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:focus:ring-cyan-900"
        type="number"
        min={min}
        max={max}
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          if (!Number.isFinite(nextValue)) return;
          onChange(Math.max(min, max === undefined ? nextValue : Math.min(nextValue, max)));
        }}
      />
      <span className="text-right font-bold text-ink">
        {suffix === '฿' ? formatBaht(value) : `${formatNumber(value)}${suffix}`}
      </span>
    </label>
  );
}
