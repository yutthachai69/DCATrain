'use client';

import Link from 'next/link';
import { PORTFOLIOS, RISK_COLORS, RISK_LABELS } from '@/lib/portfolios';
import { ASSETS } from '@/lib/assets';

export default function PortfoliosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/85">
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">Beginner Portfolios</p>
          <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">พอร์ตแนะนำสำหรับมือใหม่</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            ไม่รู้จะเริ่มยังไง? เลือกพอร์ตสำเร็จรูปที่เหมาะกับระดับความเสี่ยงของคุณ แล้ว DCA ทุกเดือนได้เลย
          </p>
        </section>

        {PORTFOLIOS.map((portfolio) => (
          <section
            key={portfolio.slug}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-ink">{portfolio.name}</h2>
                  <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${RISK_COLORS[portfolio.riskLevel]}`}>
                    {RISK_LABELS[portfolio.riskLevel]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{portfolio.subtitle}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">ผลตอบแทนคาดหวัง</p>
                <p className="text-lg font-bold text-cyan-700 dark:text-cyan-400">{portfolio.expectedReturn}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">สัดส่วนพอร์ต</p>
                <div className="mt-3 flex h-6 overflow-hidden rounded-full">
                  {portfolio.items.map((item) => (
                    <div
                      key={item.assetKey}
                      style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                      className="transition-all"
                      title={`${item.label} ${item.percent}%`}
                    />
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  {portfolio.items.map((item) => {
                    const asset = ASSETS[item.assetKey];
                    return (
                      <div key={item.assetKey} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-ink">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-ink">{item.percent}%</span>
                          {asset && (
                            <Link
                              href={`/analyzer?asset=${encodeURIComponent(item.assetKey)}`}
                              className="text-xs text-cyan-600 hover:underline dark:text-cyan-400"
                            >
                              วิเคราะห์
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">ทำไมจัดแบบนี้?</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{portfolio.description}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">เหมาะกับ</p>
                  <p className="mt-1 text-sm text-ink">{portfolio.suitableFor}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">ลงทุนขั้นต่ำ/เดือน</p>
                  <p className="mt-1 text-sm font-bold text-ink">{portfolio.monthlyMin.toLocaleString()} บาท</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                href={`/simulator`}
                className="rounded-xl bg-cyan-600 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-cyan-700"
              >
                จำลอง DCA พอร์ตนี้
              </Link>
              <Link
                href="/how-to-buy"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
              >
                เปิดบัญชีเพื่อเริ่มซื้อ
              </Link>
            </div>
          </section>
        ))}

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
          <h3 className="font-bold text-amber-800 dark:text-amber-300">คำเตือน</h3>
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
            พอร์ตเหล่านี้เป็นตัวอย่างเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำการลงทุน ผลตอบแทนในอดีตไม่ได้รับประกันผลตอบแทนในอนาคต การลงทุนมีความเสี่ยง ควรศึกษาข้อมูลก่อนตัดสินใจ
          </p>
        </section>
      </div>
    </main>
  );
}
