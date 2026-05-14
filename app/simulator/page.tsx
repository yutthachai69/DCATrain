'use client';

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Metric from '@/components/ui/Metric';
import { formatBaht } from '@/lib/format';
import { simulateDCA, RETURN_PRESETS } from '@/lib/simulator';

const GrowthChart = dynamic(() => import('@/components/charts/GrowthChart'), { ssr: false });

export default function SimulatorPage() {
  const [monthly, setMonthly] = useState(3000);
  const [years, setYears] = useState(5);
  const [returnRate, setReturnRate] = useState(0.10);
  const inflation = 0.03;

  const result = useMemo(
    () => simulateDCA({ monthlyAmount: monthly, years, annualReturn: returnRate, inflation }),
    [monthly, years, returnRate, inflation],
  );

  const chartData = useMemo(() => {
    return result.months
      .filter((m) => m.month % (years <= 3 ? 1 : years <= 10 ? 3 : 6) === 0)
      .map((m) => ({
        label: m.label,
        invested: m.invested,
        value: m.value,
      }));
  }, [result, years]);

  const yearlySnapshots = result.months.filter((m) => m.month % 12 === 0);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/85">
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">DCA Simulator</p>
          <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">จำลองผลลัพธ์การลงทุนแบบ DCA</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">ลองปรับตัวเลขดูว่า ถ้าลงทุนทุกเดือนจะได้ผลลัพธ์ยังไง</p>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ลงทุนเดือนละ</label>
                <span className="text-lg font-bold text-cyan-700 dark:text-cyan-400">{formatBaht(monthly)}</span>
              </div>
              <input
                className="mt-2 w-full accent-cyan-600"
                type="range" min="500" max="50000" step="500"
                value={monthly}
                onChange={(e) => setMonthly(Number(e.target.value))}
                aria-label="จำนวนเงินลงทุนต่อเดือน"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>500 ฿</span><span>50,000 ฿</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ระยะเวลา</label>
                <span className="text-lg font-bold text-cyan-700 dark:text-cyan-400">{years} ปี</span>
              </div>
              <input
                className="mt-2 w-full accent-cyan-600"
                type="range" min="1" max="30" step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                aria-label="ระยะเวลาลงทุน"
              />
              <div className="mt-1 flex justify-between text-xs text-slate-400">
                <span>1 ปี</span><span>30 ปี</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ผลตอบแทนเฉลี่ยต่อปี</label>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">เลือกจากตัวอย่าง หรือปรับเอง</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {RETURN_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setReturnRate(preset.value)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      returnRate === preset.value
                        ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-950 dark:text-cyan-400'
                        : 'border-slate-300 bg-white text-slate-600 hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                className="mt-3 w-full accent-cyan-600"
                type="range" min="0" max="0.5" step="0.005"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                aria-label="ผลตอบแทนเฉลี่ยต่อปี"
              />
              <p className="mt-1 text-right text-sm font-semibold text-cyan-700 dark:text-cyan-400">{(returnRate * 100).toFixed(1)}% ต่อปี</p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric title="ลงทุนทั้งหมด" value={formatBaht(result.totalInvested)} />
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-800 dark:bg-emerald-950">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">มูลค่าพอร์ต</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">{formatBaht(result.finalValue)}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-800 dark:bg-emerald-950">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">กำไรสุทธิ</p>
            <p className="mt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
              +{formatBaht(result.totalGain)}
            </p>
            <p className="mt-1 text-xs text-emerald-500 dark:text-emerald-400">+{result.totalGainPercent.toFixed(1)}%</p>
          </div>
          <Metric title="มูลค่าเทียบเงินวันนี้" value={formatBaht(result.realValue)} />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-bold text-ink">กราฟเงินเติบโต</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">สีฟ้าอ่อน = เงินที่ลง, สีเขียว = มูลค่าจริง (รวมผลตอบแทน)</p>
          <div className="mt-5 h-[380px]">
            <GrowthChart data={chartData} />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-bold text-ink">สรุปรายปี</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ดูว่าแต่ละปีพอร์ตเติบโตเท่าไหร่</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-600 dark:border-slate-600 dark:text-slate-400">
                  <th className="py-2 pr-3">ปี</th>
                  <th className="py-2 pr-3">ลงทุนสะสม</th>
                  <th className="py-2 pr-3">มูลค่าพอร์ต</th>
                  <th className="py-2 pr-3">กำไร</th>
                  <th className="py-2">กำไร %</th>
                </tr>
              </thead>
              <tbody>
                {yearlySnapshots.map((snap) => (
                  <tr key={snap.month} className="border-b border-slate-100 dark:border-slate-700">
                    <td className="py-2 pr-3 font-medium text-ink">{snap.month / 12}</td>
                    <td className="py-2 pr-3">{formatBaht(snap.invested)}</td>
                    <td className="py-2 pr-3 font-semibold text-emerald-700 dark:text-emerald-400">{formatBaht(snap.value)}</td>
                    <td className="py-2 pr-3 text-emerald-600 dark:text-emerald-400">+{formatBaht(snap.gain)}</td>
                    <td className="py-2 text-emerald-600 dark:text-emerald-400">+{snap.gainPercent.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6 dark:border-cyan-800 dark:bg-cyan-950">
          <h3 className="font-bold text-cyan-800 dark:text-cyan-300">อ่านผลลัพธ์ยังไง?</h3>
          <div className="mt-3 space-y-2 text-sm text-cyan-700 dark:text-cyan-400">
            <p><b>ลงทุนทั้งหมด</b> = เงินที่คุณจ่ายออกไปจริงๆ (เดือนละ {formatBaht(monthly)} × {years * 12} เดือน)</p>
            <p><b>มูลค่าพอร์ต</b> = เงินลงทุน + ผลตอบแทนที่ทบต้นทุกเดือน (เงินทำงานต่อเนื่อง)</p>
            <p><b>มูลค่าเทียบเงินวันนี้</b> = หักเงินเฟ้อ {(inflation * 100).toFixed(0)}%/ปี แล้ว กำลังซื้อจริงจะอยู่ที่เท่านี้</p>
            <p className="mt-2 text-xs text-cyan-600 dark:text-cyan-500">* ตัวเลขเป็นการจำลองเท่านั้น ผลตอบแทนจริงอาจต่างจากนี้ การลงทุนมีความเสี่ยง</p>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/planner"
            className="rounded-2xl bg-cyan-600 px-6 py-4 text-center font-bold text-white shadow-lg transition hover:bg-cyan-700"
          >
            วางแผนจริงจากตัวเลขของคุณ
          </Link>
          <Link
            href="/learn"
            className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            เรียนรู้เพิ่มเรื่อง DCA
          </Link>
        </div>
      </div>
    </main>
  );
}
