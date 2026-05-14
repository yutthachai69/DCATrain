import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BROKERS, CATEGORY_LABELS, getBroker, getBrokerLink } from '@/lib/brokers';
import { ASSETS } from '@/lib/assets';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return BROKERS.map((b) => ({ slug: b.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const broker = getBroker(params.slug);
  if (!broker) return {};
  return {
    title: `วิธีสมัคร ${broker.name} — เปิดบัญชีลงทุน`,
    description: `ขั้นตอนสมัคร ${broker.name} แบบ step-by-step พร้อมข้อดี ข้อเสีย ค่าธรรมเนียม และสินทรัพย์ที่ซื้อได้`,
  };
}

export default function BrokerDetailPage({ params }: Props) {
  const broker = getBroker(params.slug);
  if (!broker) notFound();

  const relatedAssets = Object.entries(ASSETS).filter(([, cfg]) =>
    cfg.brokerSlugs.includes(broker.slug),
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/how-to-buy" className="inline-flex items-center gap-1 text-sm text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-400">
          ← กลับหน้ารวม Broker
        </Link>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-ink md:text-3xl">{broker.name}</h1>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {broker.categories.map((cat) => (
                  <span key={cat} className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-400">
                    {CATEGORY_LABELS[cat]}
                  </span>
                ))}
                {broker.dcaSupport && (
                  <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-400">
                    รองรับ DCA อัตโนมัติ
                  </span>
                )}
              </div>
            </div>
            <a
              href={getBrokerLink(broker)}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-700"
            >
              สมัครตอนนี้
            </a>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">ค่าธรรมเนียม</p>
              <p className="mt-1 font-semibold text-ink">{broker.fees}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">ฝากขั้นต่ำ</p>
              <p className="mt-1 font-semibold text-ink">{broker.minDeposit}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/50">
              <p className="text-xs text-slate-500 dark:text-slate-400">เว็บไซต์</p>
              <a href={broker.url} target="_blank" rel="noopener noreferrer" className="mt-1 block truncate font-semibold text-cyan-700 hover:underline dark:text-cyan-400">
                {broker.url.replace('https://', '')}
              </a>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-xl font-bold text-ink">วิธีสมัครทีละขั้นตอน</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">ทำตามได้เลย ใช้เวลาประมาณ 5-10 นาที</p>
          <div className="mt-5 space-y-4">
            {broker.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-600 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <p className="pt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-800 dark:bg-emerald-950">
            <h3 className="font-bold text-emerald-800 dark:text-emerald-300">ข้อดี</h3>
            <ul className="mt-3 space-y-2 text-sm text-emerald-700 dark:text-emerald-400">
              {broker.pros.map((p) => (
                <li key={p}>✓ {p}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
            <h3 className="font-bold text-amber-800 dark:text-amber-300">ข้อเสีย</h3>
            <ul className="mt-3 space-y-2 text-sm text-amber-700 dark:text-amber-400">
              {broker.cons.map((c) => (
                <li key={c}>✗ {c}</li>
              ))}
            </ul>
          </section>
        </div>

        {relatedAssets.length > 0 && (
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-ink">สินทรัพย์ที่ซื้อได้ผ่าน {broker.name}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {relatedAssets.map(([key, asset]) => (
                <Link
                  key={key}
                  href={`/analyzer?asset=${encodeURIComponent(key)}`}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-cyan-600"
                >
                  <p className="font-bold text-ink">{asset.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ความเสี่ยง: {asset.riskLabel} · {asset.avgReturn}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex justify-center">
          <a
            href={getBrokerLink(broker)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-cyan-600 px-8 py-4 text-center text-lg font-bold text-white shadow-lg transition hover:bg-cyan-700"
          >
            เปิดบัญชี {broker.name} ตอนนี้
          </a>
        </div>
      </div>
    </main>
  );
}
