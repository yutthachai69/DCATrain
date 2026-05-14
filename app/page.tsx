import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/catalog';
import { PORTFOLIOS, RISK_LABELS, RISK_COLORS } from '@/lib/portfolios';

const STEPS = [
  {
    number: '1',
    title: 'รู้จักตัวเอง',
    description: 'ตอบคำถามง่ายๆ เกี่ยวกับเป้าหมาย รายรับ-รายจ่าย และความเสี่ยงที่รับได้',
    color: 'bg-cyan-50 border-cyan-200 text-cyan-700 dark:bg-cyan-950 dark:border-cyan-800 dark:text-cyan-400',
  },
  {
    number: '2',
    title: 'ได้แผนที่เหมาะกับคุณ',
    description: 'ระบบจะคำนวณเงินลงทุน สัดส่วนพอร์ต และสินทรัพย์ที่เหมาะให้อัตโนมัติ',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950 dark:border-emerald-800 dark:text-emerald-400',
  },
  {
    number: '3',
    title: 'ดูว่าตอนนี้ควรซื้อไหม',
    description: 'ระบบวิเคราะห์ราคาจริง แล้วบอกเป็นภาษาคนว่า "ซื้อได้" "รอก่อน" หรือ "หลีกเลี่ยง"',
    color: 'bg-violet-50 border-violet-200 text-violet-700 dark:bg-violet-950 dark:border-violet-800 dark:text-violet-400',
  },
];

const FAQS = [
  {
    q: 'DCA คืออะไร?',
    a: 'DCA (Dollar-Cost Averaging) คือการทยอยซื้อสินทรัพย์เป็นรอบๆ เช่น ทุกเดือน เดือนละเท่ากัน ไม่ต้องเดาว่าราคาจะขึ้นหรือลง เป็นวิธีที่เหมาะกับมือใหม่ที่สุด',
  },
  {
    q: 'ต้องมีเงินเท่าไหร่ถึงเริ่มได้?',
    a: 'เริ่มได้ตั้งแต่ 100 บาท ไม่มีขั้นต่ำที่ตายตัว สิ่งสำคัญคือเงินส่วนนี้ต้องเป็นเงินที่ไม่ต้องใช้ในชีวิตประจำวัน',
  },
  {
    q: 'โปรแกรมนี้ฟรีจริงไหม?',
    a: 'ฟรี 100% ไม่มีค่าใช้จ่ายใดๆ ไม่ต้องสมัครสมาชิก และไม่เก็บข้อมูลของคุณไว้ที่ server — ทุกอย่างอยู่ในเครื่องคุณเท่านั้น',
  },
  {
    q: 'ข้อมูลของฉันปลอดภัยไหม?',
    a: 'ข้อมูลทั้งหมดเก็บใน browser ของคุณเท่านั้น (localStorage) ไม่ส่งไปไหน ปิดหน้าต่างก็ยังอยู่ ลบได้ทุกเมื่อ',
  },
];

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <section className="mx-auto max-w-4xl px-5 pb-16 pt-12 text-center">
        <Image src="/LogoDCA.png" alt="DCA Logo" width={80} height={80} className="mx-auto h-20 w-20" priority />
        <p className="mt-4 inline-block rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-sm font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-400">
          ฟรี 100% — ไม่ต้องสมัคร — ไม่เก็บข้อมูล
        </p>

        <h1 className="mt-6 text-4xl font-black leading-relaxed tracking-tight text-ink md:text-6xl md:leading-relaxed">
          เริ่มลงทุนง่ายๆ<br />
          <span className="text-cyan-600 dark:text-cyan-400">แม้ไม่รู้เรื่องเลย</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400">
          โปรแกรมนี้จะช่วยวางแผนการลงทุนแบบ DCA ให้คุณ ตั้งแต่ประเมินตัวเอง เลือกสินทรัพย์ ไปจนถึงบอกว่าตอนนี้ควรซื้อหรือรอ — ทุกอย่างเป็นภาษาไทยที่เข้าใจง่าย
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/planner"
            className="rounded-2xl bg-cyan-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-cyan-700"
          >
            เริ่มวางแผนเลย
          </Link>
          <Link
            href="/simulator"
            className="rounded-2xl border border-cyan-300 bg-cyan-50 px-8 py-4 text-lg font-bold text-cyan-700 transition hover:bg-cyan-100 dark:border-cyan-700 dark:bg-cyan-950 dark:text-cyan-400 dark:hover:bg-cyan-900"
          >
            ลองจำลอง DCA
          </Link>
          <Link
            href="/learn"
            className="rounded-2xl border border-slate-300 bg-white px-8 py-4 text-lg font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            DCA คืออะไร?
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <h2 className="text-center text-2xl font-bold text-ink dark:text-white">3 ขั้นตอนง่ายๆ</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className={`rounded-3xl border p-6 ${step.color}`}>
              <span className="text-4xl font-black opacity-30">{step.number}</span>
              <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-80">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <h2 className="text-center text-2xl font-bold text-ink dark:text-white">สำรวจสินทรัพย์</h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">เลือกหมวดที่สนใจ เรามีข้อมูลครบทุกประเภท</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.slice(0, 4).map((cat) => (
            <Link
              key={cat.slug}
              href={`/explore/${cat.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-600"
            >
              <span className="text-2xl">{cat.icon}</span>
              <p className="mt-2 font-bold text-ink">{cat.shortName}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{cat.description}</p>
              <p className="mt-2 text-xs font-semibold text-cyan-600 group-hover:text-cyan-700 dark:text-cyan-400">ดูทั้งหมด →</p>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/explore" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-400">
            ดูหมวดทั้งหมด ({CATEGORIES.length} หมวด) →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <h2 className="text-center text-2xl font-bold text-ink dark:text-white">พอร์ตแนะนำสำหรับมือใหม่</h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">ไม่รู้จะเริ่มยังไง? เลือกพอร์ตสำเร็จรูปที่เหมาะกับคุณ</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PORTFOLIOS.map((p) => (
            <Link
              key={p.slug}
              href="/portfolios"
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-600"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink">{p.name}</h3>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${RISK_COLORS[p.riskLevel]}`}>
                  {RISK_LABELS[p.riskLevel]}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{p.subtitle}</p>
              <div className="mt-3 flex h-4 overflow-hidden rounded-full">
                {p.items.map((item) => (
                  <div key={item.assetKey} style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">ผลตอบแทนคาดหวัง: {p.expectedReturn}</p>
              <p className="mt-2 text-xs font-semibold text-cyan-600 group-hover:text-cyan-700 dark:text-cyan-400">ดูรายละเอียด →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 pb-20">
        <h2 className="text-center text-2xl font-bold text-ink dark:text-white">คำถามที่พบบ่อย</h2>
        <div className="mt-8 space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <summary className="cursor-pointer text-base font-semibold text-slate-800 dark:text-slate-200">
                {faq.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
