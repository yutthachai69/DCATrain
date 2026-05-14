'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ASSETS, TAG_CONFIG } from '@/lib/assets';
import { backtestDCA, type BacktestResult, type PriceDataPoint } from '@/lib/backtest';
import { formatBaht, formatPercent, formatNumber } from '@/lib/format';

const BacktestChart = dynamic(() => import('@/components/charts/BacktestChart'), {
  ssr: false,
  loading: () => <div className="flex h-[400px] items-center justify-center text-slate-400">กำลังโหลดกราฟ...</div>,
});

const PERIOD_OPTIONS = [
  { label: '6 เดือน', days: 180 },
  { label: '1 ปี', days: 365 },
  { label: '2 ปี', days: 730 },
  { label: '3 ปี', days: 1095 },
];

const AMOUNT_OPTIONS = [500, 1000, 2000, 3000, 5000, 10000, 20000, 50000];

export default function BacktestPage() {
  const [asset, setAsset] = useState('BTC');
  const [days, setDays] = useState(365);
  const [monthly, setMonthly] = useState(3000);
  const [prices, setPrices] = useState<PriceDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetch(`/api/analysis?asset=${encodeURIComponent(asset)}&days=${days}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'โหลดข้อมูลไม่สำเร็จ');
        const frame: Array<{ date: string; close: number }> = data.analysis?.frame || [];
        setPrices(frame.map((f) => ({ date: f.date, close: f.close })));
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [asset, days]);

  const result: BacktestResult | null = useMemo(() => {
    if (prices.length < 60) return null;
    try {
      return backtestDCA({ monthlyAmount: monthly, prices });
    } catch {
      return null;
    }
  }, [prices, monthly]);

  const assetConfig = ASSETS[asset];
  const isGain = result && result.totalGain >= 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/85">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">Backtest DCA</p>
              <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">
                ถ้า DCA ตั้งแต่อดีต จะได้เท่าไหร่?
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                ใช้ราคาจริงย้อนหลังจำลองผลลัพธ์ DCA — ไม่ใช่การคาดการณ์อนาคต
              </p>
            </div>
            <Link
              href="/simulator"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              จำลองอนาคต →
            </Link>
          </div>
        </section>

        {/* Controls */}
        <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:grid-cols-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            สินทรัพย์
            <select
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              aria-label="เลือกสินทรัพย์"
            >
              {Object.entries(ASSETS).map(([key, cfg]) => (
                <option key={key} value={key}>
                  {cfg.tags.includes('beginner') ? `⭐ ${key} — ${cfg.name}` : `${key} — ${cfg.name}`}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            ช่วงเวลาย้อนหลัง
            <select
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              aria-label="เลือกช่วงเวลา"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.days} value={opt.days}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            DCA เดือนละ
            <select
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
              value={monthly}
              onChange={(e) => setMonthly(Number(e.target.value))}
              aria-label="จำนวนเงิน DCA ต่อเดือน"
            >
              {AMOUNT_OPTIONS.map((amt) => (
                <option key={amt} value={amt}>
                  {formatBaht(amt)}
                </option>
              ))}
            </select>
          </label>
        </section>

        {/* Asset Tags */}
        {assetConfig && (
          <div className="flex flex-wrap gap-1.5">
            {assetConfig.tags.map((tag) => (
              <span key={tag} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TAG_CONFIG[tag].color}`}>
                {TAG_CONFIG[tag].label}
              </span>
            ))}
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-700 dark:text-slate-400">
              ความเสี่ยง: {assetConfig.riskLabel}
            </span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-600 dark:border-cyan-800 dark:border-t-cyan-400" />
            <p className="mt-3 text-slate-600 dark:text-slate-400">กำลังดึงข้อมูลราคาย้อนหลัง...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <>
            {/* Summary */}
            <section
              className={`rounded-3xl border p-6 shadow-sm ${
                isGain
                  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950'
                  : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
              }`}
            >
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                ผลลัพธ์ DCA {asset} ย้อนหลัง {result.months.length} เดือน · เดือนละ {formatBaht(monthly)}
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">ลงทุนทั้งหมด</p>
                  <p className="mt-1 text-2xl font-bold text-ink">{formatBaht(result.totalInvested)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">มูลค่าปัจจุบัน</p>
                  <p className="mt-1 text-2xl font-bold text-ink">{formatBaht(result.finalValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">กำไร/ขาดทุน</p>
                  <p className={`mt-1 text-2xl font-bold ${isGain ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                    {isGain ? '+' : ''}{formatBaht(result.totalGain)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">ผลตอบแทนรวม</p>
                  <p className={`mt-1 text-2xl font-bold ${isGain ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                    {formatPercent(result.totalGainPercent)}
                  </p>
                </div>
              </div>
            </section>

            {/* Chart */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-xl font-bold text-ink">กราฟผลลัพธ์ DCA</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                เส้นสีเขียว = มูลค่าพอร์ต · เส้นสีน้ำเงิน = เงินที่ลงทุน
              </p>
              <div className="mt-5 h-[400px]">
                <BacktestChart data={result.months} />
              </div>
            </section>

            {/* Stats Grid */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="ต้นทุนเฉลี่ยต่อหน่วย" value={formatNumber(result.avgCostPerUnit)} />
              <StatCard title="จำนวนหน่วยรวม" value={formatNumber(result.totalUnits)} />
              <StatCard
                title="Max Drawdown"
                value={`-${result.maxDrawdown.toFixed(1)}%`}
                sub={result.maxDrawdownDate ? `เกิดเมื่อ ${result.maxDrawdownDate}` : undefined}
              />
              <StatCard
                title="เดือนที่ผลตอบแทนดีสุด"
                value={formatPercent(result.bestMonth.gainPercent)}
                sub={result.bestMonth.date}
              />
            </section>

            {/* Monthly Table */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-xl font-bold text-ink">รายละเอียดรายเดือน</h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
                      <th className="px-3 py-2">เดือน</th>
                      <th className="px-3 py-2 text-right">ราคาเฉลี่ย</th>
                      <th className="px-3 py-2 text-right">ลงทุนสะสม</th>
                      <th className="px-3 py-2 text-right">มูลค่า</th>
                      <th className="px-3 py-2 text-right">กำไร/ขาดทุน</th>
                      <th className="px-3 py-2 text-right">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.months.map((m) => (
                      <tr
                        key={m.date}
                        className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-700/50"
                      >
                        <td className="px-3 py-2 font-medium">{m.date}</td>
                        <td className="px-3 py-2 text-right">{formatNumber(m.price)}</td>
                        <td className="px-3 py-2 text-right">{formatBaht(m.invested)}</td>
                        <td className="px-3 py-2 text-right">{formatBaht(m.value)}</td>
                        <td className={`px-3 py-2 text-right font-medium ${m.gain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {m.gain >= 0 ? '+' : ''}{formatBaht(m.gain)}
                        </td>
                        <td className={`px-3 py-2 text-right font-medium ${m.gainPercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatPercent(m.gainPercent)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Disclaimer */}
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
              <h3 className="font-bold text-amber-800 dark:text-amber-300">ข้อควรรู้</h3>
              <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-400">
                <li>- ผลลัพธ์นี้ใช้ราคาจริงในอดีต ไม่ใช่การรับประกันผลตอบแทนในอนาคต</li>
                <li>- ยังไม่ได้หักค่าธรรมเนียมซื้อขาย สเปรด และภาษี</li>
                <li>- จำลองว่าซื้อวันแรกของทุกเดือน ด้วยราคาเฉลี่ยของเดือนนั้น</li>
                <li>- DCA ช่วยลดความเสี่ยงจากจังหวะ แต่ไม่ได้ลดความเสี่ยงของตัวสินทรัพย์เอง</li>
              </ul>
            </section>

            {/* CTA */}
            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                href={`/analyzer?asset=${encodeURIComponent(asset)}`}
                className="rounded-2xl border border-cyan-300 bg-cyan-50 px-6 py-4 text-center font-bold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-700 dark:bg-cyan-950 dark:text-cyan-400 dark:hover:bg-cyan-900"
              >
                วิเคราะห์ {asset} ตอนนี้
              </Link>
              <Link
                href="/simulator"
                className="rounded-2xl border border-violet-300 bg-violet-50 px-6 py-4 text-center font-bold text-violet-700 transition hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-400 dark:hover:bg-violet-900"
              >
                จำลองอนาคต
              </Link>
              <Link
                href="/portfolios"
                className="rounded-2xl border border-emerald-300 bg-emerald-50 px-6 py-4 text-center font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900"
              >
                ดูพอร์ตแนะนำ
              </Link>
            </div>
          </>
        )}

        {!loading && !error && !result && prices.length > 0 && prices.length < 60 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
            ข้อมูลราคาไม่เพียงพอสำหรับ backtest กรุณาเลือกช่วงเวลาที่ยาวขึ้น
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
