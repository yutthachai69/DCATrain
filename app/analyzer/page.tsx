'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ASSETS, GLOSSARY, getBrokersForAsset } from '@/lib/assets';
import { getBrokerLink } from '@/lib/brokers';
import type { Analysis } from '@/lib/analysis';
import Metric from '@/components/ui/Metric';
import Insight from '@/components/ui/Insight';
import { formatNumber, formatPercent } from '@/lib/format';

const PriceChart = dynamic(() => import('@/components/charts/PriceChart'), { ssr: false });

type ApiResponse = {
  assetKey: string;
  asset: { name: string; symbol: string };
  analysis: Analysis;
  error?: string;
};

const SIGNAL_STYLE = {
  'ซื้อได้': { icon: '🟢', className: 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' },
  'รอก่อน': { icon: '🟡', className: 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400' },
  'หลีกเลี่ยง': { icon: '🔴', className: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400' },
};

const SIGNAL_EXPLAIN = {
  'ซื้อได้': 'ตัวชี้วัดหลายตัวบ่งบอกว่าแนวโน้มค่อนข้างดี ถ้าคุณวางแผนจะลงทุนอยู่แล้ว ช่วงนี้เป็นจังหวะที่พอรับได้',
  'รอก่อน': 'สัญญาณยังไม่ชัดเจน อาจจะขึ้นหรือลงก็ได้ ถ้าไม่รีบ รอดูอีกสักพักจะปลอดภัยกว่า',
  'หลีกเลี่ยง': 'ตัวชี้วัดบอกว่าความเสี่ยงค่อนข้างสูง ถ้าเป็นมือใหม่ควรรอให้แนวโน้มดีขึ้นก่อน',
};

export default function AnalyzerPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-slate-500 dark:text-slate-400">กำลังโหลด...</div>}>
      <AnalyzerContent />
    </Suspense>
  );
}

function AnalyzerContent() {
  const searchParams = useSearchParams();
  const initialAsset = searchParams.get('asset') || 'BTC';

  const [asset, setAsset] = useState(() => ASSETS[initialAsset] ? initialAsset : 'BTC');
  const [days, setDays] = useState(365);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    fetch(`/api/analysis?asset=${encodeURIComponent(asset)}&days=${days}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'โหลดข้อมูลไม่สำเร็จ');
        return payload as ApiResponse;
      })
      .then(setData)
      .catch((fetchError) => {
        if (fetchError.name !== 'AbortError') setError(fetchError.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [asset, days]);

  const chartData = useMemo(() => data?.analysis.frame.slice(-180) || [], [data]);
  const currentSignal = data?.analysis.signal || 'รอก่อน';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white/85 dark:bg-slate-800/85 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">วิเคราะห์สินทรัพย์</p>
              <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">ดูว่าตอนนี้ควรซื้อไหม</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">ระบบจะวิเคราะห์ราคาจริงแล้วสรุปเป็นสัญญาณที่เข้าใจง่าย</p>
            </div>
            <Link
              href="/planner"
              className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              กลับไปปรับแผน
            </Link>
          </div>
        </section>

        <section className="grid gap-3 rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            เลือกสินทรัพย์
            <select
              className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              aria-label="เลือกสินทรัพย์ที่ต้องการวิเคราะห์"
            >
              {Object.entries(ASSETS).map(([key, value]) => (
                <option key={key} value={key}>{`${key} — ${value.name}`}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            วันย้อนหลัง: {days} วัน
            <input
              className="mt-4 w-full accent-cyan-600"
              type="range"
              min="120"
              max="1095"
              step="30"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              aria-label={`วันย้อนหลัง ${days} วัน`}
            />
          </label>
        </section>

        {error && (
          <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 p-4 text-red-700 dark:text-red-400">{error}</div>
        )}

        {loading && (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-cyan-200 dark:border-cyan-800 border-t-cyan-600 dark:border-t-cyan-400" />
            <p className="mt-3 text-slate-600 dark:text-slate-400">กำลังดึงข้อมูลและวิเคราะห์...</p>
          </div>
        )}

        {data && !loading && (
          <>
            <section className={`rounded-3xl border p-6 shadow-sm ${SIGNAL_STYLE[currentSignal].className}`}>
              <p className="text-sm font-semibold">ผลวิเคราะห์ {data.assetKey} — {data.asset.name}</p>
              <h2 className="mt-2 text-4xl font-black">
                {SIGNAL_STYLE[currentSignal].icon} {currentSignal}
              </h2>
              <p className="mt-3 text-lg">{data.analysis.advice}</p>
              <p className="mt-2 text-sm opacity-80">{SIGNAL_EXPLAIN[currentSignal]}</p>
            </section>

            <section className="grid gap-4 md:grid-cols-5">
              <Metric title="ราคาล่าสุด" value={formatNumber(data.analysis.latestPrice)} />
              <Metric title="เปลี่ยนแปลง 30 วัน" value={formatPercent(data.analysis.change30d)} />
              <Metric title="เปลี่ยนแปลง 90 วัน" value={formatPercent(data.analysis.change90d)} />
              <MetricWithExplain
                title="RSI"
                value={data.analysis.rsi.toFixed(1)}
                explain={explainRsi(data.analysis.rsi)}
              />
              <MetricWithExplain
                title="ความผันผวน"
                value={formatPercent(data.analysis.volatility * 100)}
                explain={explainVolatility(data.analysis.volatility)}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-ink">กราฟราคาและแนวโน้ม</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">เส้นสีฟ้า = ราคาจริง, เส้นสีส้ม = ค่าเฉลี่ย 30 วัน, เส้นสีม่วง = ค่าเฉลี่ย 90 วัน</p>
                <div className="mt-5 h-[420px]">
                  <PriceChart data={chartData} />
                </div>
              </div>

              <div className="space-y-4">
                <Insight title="จุดที่ดูดี" items={data.analysis.reasons} tone="good" />
                <Insight title="จุดที่ควรระวัง" items={data.analysis.cautions} tone="warn" />
                <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
                  <h3 className="font-bold text-ink">ตัวเลขสำคัญ</h3>
                  <div className="mt-3 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                    <p>ค่าเฉลี่ย 30 วัน: {formatNumber(data.analysis.ma30)}</p>
                    <p>ค่าเฉลี่ย 90 วัน: {formatNumber(data.analysis.ma90)}</p>
                    <p>MACD: {data.analysis.macd.toFixed(2)}</p>
                    <p>MACD Signal: {data.analysis.macdSignal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </section>

            <AssetBuyingGuide assetKey={data.assetKey} />

            <section className="rounded-3xl border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950 p-6">
              <h3 className="font-bold text-cyan-800 dark:text-cyan-300">ขั้นตอน DCA สำหรับมือใหม่</h3>
              <div className="mt-3 space-y-2 text-sm text-cyan-700 dark:text-cyan-400">
                <p>1. เปิดบัญชีกับ platform ที่แนะนำด้านบน (ใช้เวลา 5-10 นาที)</p>
                <p>2. ตั้งยอดเงินที่จะ DCA ทุกเดือน — ไม่ต้องมาก เริ่มจากจำนวนที่สบายใจ</p>
                <p>3. ตั้งวันซื้อประจำ เช่น ทุกวันที่ 1 หรือวันเงินเดือนออก แล้วซื้อเท่ากันทุกเดือน</p>
                <p>4. ไม่ต้องดูราคาทุกวัน — เช็คเดือนละครั้งก็พอ</p>
              </div>
            </section>
          </>
        )}

        <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-ink">อธิบายศัพท์แบบง่าย</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {Object.entries(GLOSSARY).map(([term, description]) => (
              <details key={term} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                <summary className="cursor-pointer font-semibold text-slate-800 dark:text-slate-200">{term}</summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricWithExplain({ title, value, explain }: { title: string; value: string; explain: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{explain}</p>
    </div>
  );
}

function explainRsi(rsi: number): string {
  if (rsi > 70) return 'สูง — อาจเริ่มแพงเกินไป';
  if (rsi < 30) return 'ต่ำ — ราคาลงแรง รอดูก่อน';
  if (rsi >= 45 && rsi <= 65) return 'ปกติ — ยังไม่ร้อนแรง';
  return 'ค่อนข้างกลาง';
}

function explainVolatility(vol: number): string {
  if (vol > 0.75) return 'สูงมาก — ราคาแกว่งแรง';
  if (vol > 0.5) return 'สูง — มีความผันผวนพอสมควร';
  if (vol < 0.25) return 'ต่ำ — ค่อนข้างนิ่ง';
  return 'ปานกลาง';
}

function AssetBuyingGuide({ assetKey }: { assetKey: string }) {
  const assetConfig = ASSETS[assetKey];
  if (!assetConfig) return null;

  const brokers = getBrokersForAsset(assetKey);

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
      <h3 className="text-xl font-bold text-ink">รู้จัก {assetKey} — {assetConfig.name}</h3>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{assetConfig.description}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">ระดับความเสี่ยง</p>
          <p className="mt-1 text-lg font-bold text-ink">{assetConfig.riskLabel}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">ผลตอบแทนเฉลี่ย</p>
          <p className="mt-1 text-lg font-bold text-ink">{assetConfig.avgReturn}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">ซื้อขั้นต่ำ</p>
          <p className="mt-1 text-lg font-bold text-ink">{assetConfig.minBuy}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">ซื้อได้ที่ไหน?</p>
          <ul className="mt-1 space-y-1.5">
            {brokers.map((broker) => (
              <li key={broker.slug} className="flex items-center justify-between">
                <Link href={`/how-to-buy/${broker.slug}`} className="text-sm font-medium text-cyan-700 hover:underline dark:text-cyan-400">
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
    </section>
  );
}
