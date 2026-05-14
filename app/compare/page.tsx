'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ASSETS, getBrokersForAsset } from '@/lib/assets';
import { getBrokerLink } from '@/lib/brokers';
import type { Analysis } from '@/lib/analysis';
import { formatNumber, formatPercent } from '@/lib/format';

type ApiResponse = {
  assetKey: string;
  asset: { name: string; symbol: string };
  analysis: Analysis;
};

const ASSET_KEYS = Object.keys(ASSETS);

export default function ComparePage() {
  const [left, setLeft] = useState('S&P500');
  const [right, setRight] = useState('BTC');
  const [leftData, setLeftData] = useState<ApiResponse | null>(null);
  const [rightData, setRightData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      fetchAsset(left),
      fetchAsset(right),
    ]).then(([l, r]) => {
      setLeftData(l);
      setRightData(r);
      if (!l || !r) setError('ดึงข้อมูลบางสินทรัพย์ไม่สำเร็จ กรุณาลองใหม่');
    }).catch(() => {
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }).finally(() => setLoading(false));
  }, [left, right]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/85">
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">เปรียบเทียบสินทรัพย์</p>
          <h1 className="mt-1 text-2xl font-bold text-ink dark:text-white md:text-3xl">เลือก 2 ตัว แล้วดูข้างกัน</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">เปรียบเทียบราคา สัญญาณ ความเสี่ยง และผลตอบแทน แบบเข้าใจง่าย</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <AssetSelect label="สินทรัพย์ A" value={left} onChange={setLeft} />
          <AssetSelect label="สินทรัพย์ B" value={right} onChange={setRight} />
        </section>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600" />
            <p className="mt-3 text-slate-600 dark:text-slate-400">กำลังดึงข้อมูล...</p>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">{error}</div>
        )}

        {!loading && leftData && rightData && (
          <>
            <CompareSignals left={leftData} right={rightData} />
            <CompareTable left={leftData} right={rightData} />
            <CompareRisk leftKey={left} rightKey={right} />
            <CompareBuyingInfo leftKey={left} rightKey={right} />
          </>
        )}

        <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6 dark:border-cyan-800 dark:bg-cyan-950">
          <h3 className="font-bold text-cyan-800 dark:text-cyan-300">ยังไม่แน่ใจ?</h3>
          <p className="mt-2 text-sm text-cyan-700 dark:text-cyan-400">ถ้าเป็นมือใหม่ ลองเริ่มจาก S&P 500 ซึ่งกระจายความเสี่ยงได้ดีที่สุด แล้วค่อยเพิ่มสินทรัพย์อื่นทีหลัง</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/planner" className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-700">
              วางแผนส่วนตัว
            </Link>
            <Link href="/simulator" className="rounded-xl border border-cyan-300 bg-white px-5 py-2.5 text-sm font-bold text-cyan-700 transition hover:bg-cyan-50 dark:border-cyan-700 dark:bg-slate-800 dark:text-cyan-400">
              จำลอง DCA
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function AssetSelect({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
      <select
        className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-semibold text-ink dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {ASSET_KEYS.map((key) => (
          <option key={key} value={key}>{key} — {ASSETS[key].name}</option>
        ))}
      </select>
    </label>
  );
}

function CompareSignals({ left, right }: { left: ApiResponse; right: ApiResponse }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <SignalCard data={left} />
      <SignalCard data={right} />
    </div>
  );
}

function SignalCard({ data }: { data: ApiResponse }) {
  const s = data.analysis.signal;
  const style = {
    'ซื้อได้': 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    'รอก่อน': 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
    'หลีกเลี่ยง': 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
  }[s];
  const icon = { 'ซื้อได้': '🟢', 'รอก่อน': '🟡', 'หลีกเลี่ยง': '🔴' }[s];

  return (
    <div className={`rounded-2xl border p-5 ${style}`}>
      <p className="text-sm font-semibold">{data.assetKey} — {data.asset.name}</p>
      <p className="mt-2 text-3xl font-black">{icon} {s}</p>
      <p className="mt-2 text-sm opacity-80">{data.analysis.advice}</p>
    </div>
  );
}

function CompareTable({ left, right }: { left: ApiResponse; right: ApiResponse }) {
  const rows = [
    { label: 'ราคาล่าสุด', l: formatNumber(left.analysis.latestPrice), r: formatNumber(right.analysis.latestPrice) },
    { label: 'เปลี่ยนแปลง 30 วัน', l: formatPercent(left.analysis.change30d), r: formatPercent(right.analysis.change30d) },
    { label: 'เปลี่ยนแปลง 90 วัน', l: formatPercent(left.analysis.change90d), r: formatPercent(right.analysis.change90d) },
    { label: 'RSI', l: left.analysis.rsi.toFixed(1), r: right.analysis.rsi.toFixed(1) },
    { label: 'ความผันผวน', l: formatPercent(left.analysis.volatility * 100), r: formatPercent(right.analysis.volatility * 100) },
    { label: 'MACD', l: left.analysis.macd.toFixed(2), r: right.analysis.macd.toFixed(2) },
    { label: 'คะแนนวิเคราะห์', l: `${left.analysis.score}`, r: `${right.analysis.score}` },
  ];

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <table className="w-full text-sm">
        <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <th className="py-3 pl-5 text-left text-slate-500 dark:text-slate-400">ตัวชี้วัด</th>
            <th className="py-3 text-center font-bold text-cyan-700 dark:text-cyan-400">{left.assetKey}</th>
            <th className="py-3 pr-5 text-center font-bold text-cyan-700 dark:text-cyan-400">{right.assetKey}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-slate-100 dark:border-slate-700">
              <td className="py-3 pl-5 text-slate-600 dark:text-slate-400">{row.label}</td>
              <td className="py-3 text-center font-semibold text-ink dark:text-white">{row.l}</td>
              <td className="py-3 pr-5 text-center font-semibold text-ink dark:text-white">{row.r}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function CompareRisk({ leftKey, rightKey }: { leftKey: string; rightKey: string }) {
  const la = ASSETS[leftKey];
  const ra = ASSETS[rightKey];
  if (!la || !ra) return null;

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {[{ key: leftKey, a: la }, { key: rightKey, a: ra }].map(({ key, a }) => (
        <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{key} — ความเสี่ยง</p>
          <p className="mt-2 text-2xl font-bold text-ink dark:text-white">{a.riskLabel}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{a.description}</p>
          <p className="mt-2 text-xs text-slate-400">ผลตอบแทนเฉลี่ย: {a.avgReturn}</p>
        </div>
      ))}
    </section>
  );
}

function CompareBuyingInfo({ leftKey, rightKey }: { leftKey: string; rightKey: string }) {
  const la = ASSETS[leftKey];
  const ra = ASSETS[rightKey];
  if (!la || !ra) return null;

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      {[{ key: leftKey, a: la }, { key: rightKey, a: ra }].map(({ key }) => {
        const brokers = getBrokersForAsset(key);
        const asset = ASSETS[key]!;
        return (
          <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{key} — ซื้อยังไง?</p>
            <p className="mt-2 text-sm text-ink dark:text-white"><b>ขั้นต่ำ:</b> {asset.minBuy}</p>
            <div className="mt-2">
              <p className="text-sm font-medium text-ink dark:text-white">ซื้อได้ที่:</p>
              <ul className="mt-1 space-y-1.5">
                {brokers.map((broker) => (
                  <li key={broker.slug} className="flex items-center justify-between">
                    <Link href={`/how-to-buy/${broker.slug}`} className="text-sm text-cyan-700 hover:underline dark:text-cyan-400">
                      {broker.name}
                    </Link>
                    <a href={getBrokerLink(broker)} target="_blank" rel="noopener noreferrer" className="rounded bg-cyan-600 px-2 py-0.5 text-xs font-semibold text-white hover:bg-cyan-700">
                      สมัคร
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </section>
  );
}

async function fetchAsset(key: string): Promise<ApiResponse | null> {
  try {
    const res = await fetch(`/api/analysis?asset=${encodeURIComponent(key)}&days=365`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
