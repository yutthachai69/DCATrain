'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BROKERS, CATEGORY_LABELS, getBrokerLink, type AssetCategory } from '@/lib/brokers';

const ALL_CATEGORIES: AssetCategory[] = ['crypto', 'thai-stock', 'us-stock', 'etf', 'fund', 'gold', 'commodity'];

export default function HowToBuyPage() {
  const [filter, setFilter] = useState<AssetCategory | 'all'>('all');

  const filtered = filter === 'all'
    ? BROKERS
    : BROKERS.filter((b) => b.categories.includes(filter));

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/85">
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">Broker Directory</p>
          <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">ซื้อที่ไหนดี? เปรียบเทียบ Broker</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            เลือก broker ที่เหมาะกับสินทรัพย์ที่คุณสนใจ พร้อมขั้นตอนเปิดบัญชีแบบ step-by-step
          </p>
        </section>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              filter === 'all'
                ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-950 dark:text-cyan-400'
                : 'border-slate-300 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            ทั้งหมด
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                filter === cat
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-950 dark:text-cyan-400'
                  : 'border-slate-300 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((broker) => (
            <div
              key={broker.slug}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-bold text-ink">{broker.name}</h2>
                  {broker.dcaSupport && (
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">
                      DCA
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap gap-1">
                  {broker.categories.map((cat) => (
                    <span key={cat} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                      {CATEGORY_LABELS[cat]}
                    </span>
                  ))}
                </div>

                <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <p>ค่าธรรมเนียม: <span className="font-medium text-ink">{broker.fees}</span></p>
                  <p>ขั้นต่ำ: <span className="font-medium text-ink">{broker.minDeposit}</span></p>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">ข้อดี:</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{broker.pros[0]}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  href={`/how-to-buy/${broker.slug}`}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                >
                  ดูวิธีสมัคร
                </Link>
                <a
                  href={getBrokerLink(broker)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-cyan-600 px-3 py-2.5 text-center text-sm font-bold text-white transition hover:bg-cyan-700"
                >
                  สมัครเลย
                </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-10 text-center text-slate-500 dark:text-slate-400">ไม่พบ broker ในหมวดนี้</p>
        )}
      </div>
    </main>
  );
}
