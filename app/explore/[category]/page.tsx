import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CATEGORIES, getCategory } from '@/lib/catalog';
import { ASSETS, getAssetsByCategory } from '@/lib/assets';

type Props = { params: { category: string } };

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const cat = getCategory(params.category);
  if (!cat) return {};
  return {
    title: `${cat.name} — สำรวจสินทรัพย์`,
    description: `${cat.description} เหมาะกับ: ${cat.suitableFor}`,
  };
}

export default function CategoryPage({ params }: Props) {
  const cat = getCategory(params.category);
  if (!cat) notFound();

  const assets = getAssetsByCategory(cat.slug);
  const beginnerAsset = ASSETS[cat.beginnerPick];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link href="/explore" className="inline-flex items-center gap-1 text-sm text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-400">
          ← กลับหน้าสำรวจ
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{cat.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-ink md:text-3xl">{cat.name}</h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ความเสี่ยง: {cat.riskLevel} · {assets.length} สินทรัพย์</p>
            </div>
          </div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">{cat.description}</p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-800 dark:bg-cyan-950">
            <h3 className="font-bold text-cyan-800 dark:text-cyan-300">ทำไมถึงน่าลงทุน?</h3>
            <p className="mt-2 text-sm text-cyan-700 dark:text-cyan-400">{cat.whyInvest}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <h3 className="font-bold text-ink">เหมาะกับใคร?</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{cat.suitableFor}</p>
          </div>
        </div>

        {beginnerAsset && (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-300">มือใหม่ควรเริ่มจากตัวไหน?</h3>
            <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
              แนะนำ <b>{beginnerAsset.name}</b> — {beginnerAsset.description}
            </p>
            <Link
              href={`/analyzer?asset=${encodeURIComponent(cat.beginnerPick)}`}
              className="mt-3 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              วิเคราะห์ {beginnerAsset.name} ตอนนี้
            </Link>
          </section>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-bold text-ink">สินทรัพย์ทั้งหมดในหมวด{cat.shortName}</h2>
          <div className="mt-4 space-y-3">
            {assets.map(([key, cfg]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-cyan-600"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink">{cfg.name}</p>
                    <span className="rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-600 dark:bg-slate-600 dark:text-slate-400">{key}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{cfg.description}</p>
                  <div className="mt-1 flex gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>ความเสี่ยง: {cfg.riskLabel}</span>
                    <span>ผลตอบแทน: {cfg.avgReturn}</span>
                  </div>
                </div>
                <Link
                  href={`/analyzer?asset=${encodeURIComponent(key)}`}
                  className="ml-3 shrink-0 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-700"
                >
                  วิเคราะห์
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
