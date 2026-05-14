'use client';

type Props = {
  title: string;
  items: string[];
  tone: 'good' | 'warn';
};

export default function Insight({ title, items, tone }: Props) {
  const className = tone === 'good'
    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
    : 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300';

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${className}`}>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {items.length
          ? items.map((item) => <li key={item}>- {item}</li>)
          : <li>- ยังไม่มีประเด็นเด่น</li>}
      </ul>
    </div>
  );
}
