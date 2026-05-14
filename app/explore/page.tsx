'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ASSETS } from '@/lib/assets';
import { CATEGORIES } from '@/lib/catalog';

export default function ExplorePage() {
  const [query, setQuery] = useState('');

  const allAssets = Object.entries(ASSETS);
  const filtered = query.trim()
    ? allAssets.filter(([key, cfg]) =>
        key.toLowerCase().includes(query.toLowerCase()) ||
        cfg.name.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/85">
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">สำรวจสินทรัพย์</p>
          <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">ลงทุนในอะไรได้บ้าง?</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            เลือกหมวดที่สนใจ หรือค้นหาสินทรัพย์ที่ต้องการ
          </p>

          <div className="relative mt-4">
            <input
              type="text"
              placeholder="ค้นหา เช่น Bitcoin, PTT, Apple, ทอง..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-cyan-900"
            />
            {filtered.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {filtered.map(([key, cfg]) => (
                  <Link
                    key={key}
                    href={`/analyzer?asset=${encodeURIComponent(key)}`}
                    onClick={() => setQuery('')}
                    className="flex items-center justify-between px-4 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <div>
                      <p className="font-semibold text-ink">{cfg.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{key} · {cfg.riskLabel}</p>
                    </div>
                    <span className="text-xs text-cyan-600 dark:text-cyan-400">วิเคราะห์ →</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => {
            const assets = allAssets.filter(([, c]) => c.category === cat.slug);
            return (
              <Link
                key={cat.slug}
                href={`/explore/${cat.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-cyan-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-600"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <div>
                    <h2 className="text-lg font-bold text-ink">{cat.name}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{assets.length} สินทรัพย์ · ความเสี่ยง {cat.riskLevel}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{cat.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {assets.slice(0, 4).map(([key]) => (
                    <span key={key} className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                      {key}
                    </span>
                  ))}
                  {assets.length > 4 && (
                    <span className="text-xs text-slate-400">+{assets.length - 4}</span>
                  )}
                </div>
                <p className="mt-3 text-xs font-semibold text-cyan-600 group-hover:text-cyan-700 dark:text-cyan-400">
                  ดูทั้งหมด →
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
