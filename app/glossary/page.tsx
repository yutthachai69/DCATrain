'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  GLOSSARY_ENTRIES,
  GLOSSARY_CATEGORIES,
  searchGlossary,
  type GlossaryCategory,
} from '@/lib/glossary';

export default function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | 'all'>('all');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const searched = searchGlossary(query);
    if (activeCategory === 'all') return searched;
    return searched.filter((e) => e.category === activeCategory);
  }, [query, activeCategory]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="text-center">
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">คลังศัพท์</p>
          <h1 className="mt-2 text-3xl font-black text-ink md:text-4xl">ศัพท์การลงทุน A-Z</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            รวม {GLOSSARY_ENTRIES.length} คำศัพท์ อธิบายง่ายๆ สำหรับมือใหม่
          </p>
        </section>

        <section className="sticky top-16 z-10 space-y-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/90">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาศัพท์... เช่น DCA, RSI, FOMO"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-ink placeholder-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-600 dark:bg-slate-700 dark:placeholder-slate-500"
            aria-label="ค้นหาศัพท์"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                activeCategory === 'all'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              ทั้งหมด ({GLOSSARY_ENTRIES.length})
            </button>
            {(Object.entries(GLOSSARY_CATEGORIES) as [GlossaryCategory, { label: string; icon: string }][]).map(
              ([key, val]) => {
                const count = GLOSSARY_ENTRIES.filter((e) => e.category === key).length;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveCategory(key)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                      activeCategory === key
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {val.icon} {val.label} ({count})
                  </button>
                );
              },
            )}
          </div>
        </section>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xl">🔍</p>
            <p className="mt-2 font-bold text-ink">ไม่พบคำศัพท์ที่ค้นหา</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
          </div>
        ) : (
          <section className="space-y-3">
            {filtered.map((entry) => {
              const isExpanded = expandedTerm === entry.term;
              const catInfo = GLOSSARY_CATEGORIES[entry.category];
              return (
                <div
                  key={entry.term}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm transition dark:border-slate-700 dark:bg-slate-800"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedTerm(isExpanded ? null : entry.term)}
                    className="flex w-full items-start gap-3 p-5 text-left"
                    aria-expanded={isExpanded}
                  >
                    <span className="mt-0.5 text-lg">{catInfo.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-ink">{entry.term}</h3>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                          {catInfo.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{entry.short}</p>
                    </div>
                    <span className={`mt-1 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-700">
                      <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{entry.long}</p>
                      {entry.related && entry.related.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="text-xs text-slate-400">เกี่ยวข้อง:</span>
                          {entry.related.map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() => {
                                setQuery(r);
                                setActiveCategory('all');
                              }}
                              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 transition hover:bg-cyan-100 hover:text-cyan-700 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-cyan-900 dark:hover:text-cyan-400"
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        <section className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/learn"
            className="rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-600"
          >
            <p className="text-2xl">📚</p>
            <p className="mt-2 font-bold text-ink">บทเรียนการลงทุน</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">เรียนรู้ตั้งแต่พื้นฐาน</p>
          </Link>
          <Link
            href="/quiz"
            className="rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-600"
          >
            <p className="text-2xl">🧠</p>
            <p className="mt-2 font-bold text-ink">ทดสอบความรู้</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Quiz 10 ข้อ</p>
          </Link>
        </section>
      </div>
    </main>
  );
}
