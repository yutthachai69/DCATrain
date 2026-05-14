import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'เรียนรู้ DCA — การลงทุนแบบง่ายที่สุด',
  description: 'อธิบาย DCA, การลงทุนคืออะไร, กฎก่อนเริ่มลงทุน และศัพท์สำคัญ อ่านจบใน 3 นาที',
};

const SECTIONS = [
  {
    title: 'การลงทุนคืออะไร?',
    body: 'การลงทุนคือการนำเงินไปทำงานแทนคุณ แทนที่จะเก็บไว้ในบัญชีออมทรัพย์ที่ดอกเบี้ยต่ำกว่าค่าครองชีพที่เพิ่มขึ้น (เงินเฟ้อ) คุณสามารถซื้อสินทรัพย์ที่มีโอกาสเติบโตในระยะยาว เช่น กองทุนดัชนี หุ้น ทอง หรือคริปโต',
  },
  {
    title: 'DCA คืออะไร?',
    body: 'DCA ย่อมาจาก Dollar-Cost Averaging แปลง่ายๆ คือ "ทยอยซื้อทุกรอบ จำนวนเงินเท่ากัน" เช่น ซื้อทุกวันที่ 1 ของเดือน เดือนละ 3,000 บาท ไม่ว่าราคาจะขึ้นหรือลง วิธีนี้ช่วยลดความเสี่ยงจากการซื้อผิดจังหวะ',
  },
  {
    title: 'ทำไม DCA ถึงเหมาะกับมือใหม่?',
    body: 'เพราะคุณไม่ต้องเดาราคา ไม่ต้องดูกราฟทุกวัน แค่ตั้งเงินจำนวนหนึ่งแล้วซื้อสม่ำเสมอ ในระยะยาวราคาซื้อเฉลี่ยจะถูกกว่าคนที่พยายามจับจังหวะตลาด เพราะคุณซื้อทั้งตอนราคาถูกและแพง แต่เฉลี่ยแล้วจะอยู่ในเกณฑ์ดี',
  },
];

const EXAMPLE = {
  monthly: 3000,
  months: [
    { month: 'ม.ค.', price: 100, units: 30.0 },
    { month: 'ก.พ.', price: 80, units: 37.5 },
    { month: 'มี.ค.', price: 120, units: 25.0 },
    { month: 'เม.ย.', price: 90, units: 33.3 },
    { month: 'พ.ค.', price: 110, units: 27.3 },
    { month: 'มิ.ย.', price: 130, units: 23.1 },
  ],
};

const TERMS = [
  { term: 'RSI', meaning: 'ตัวเลขที่บอกว่าราคาขึ้นหรือลงแรงเกินไปหรือไม่ ถ้าสูงกว่า 70 = อาจเริ่มแพง, ต่ำกว่า 30 = ลงแรงมาก' },
  { term: 'MACD', meaning: 'ตัวดูว่าแรงส่งของราคาเป็นบวกหรือลบ ถ้าเส้น MACD ตัดขึ้น = แรงส่งดีขึ้น' },
  { term: 'ค่าเฉลี่ย (MA)', meaning: 'เส้นราคาเฉลี่ยย้อนหลัง ใช้ดูว่าราคาปัจจุบันอยู่ในแนวโน้มขาขึ้นหรือขาลง' },
  { term: 'ความผันผวน', meaning: 'ระดับการแกว่งของราคา ยิ่งสูง = ราคาขึ้นลงแรง มีทั้งโอกาสกำไรและขาดทุนมากขึ้น' },
  { term: 'Risk Score', meaning: 'คะแนนความเสี่ยงที่ระบบคำนวณจากข้อมูลของคุณ ยิ่งสูง = รับเสี่ยงได้มาก แนะนำสินทรัพย์เติบโตมากขึ้น' },
  { term: 'เงินสำรองฉุกเฉิน', meaning: 'เงินที่ต้องเก็บไว้สำหรับเหตุไม่คาดคิด (ป่วย ตกงาน ของพัง) ควรมีอย่างน้อย 3-6 เดือนของค่าใช้จ่าย' },
];

const totalUnits = EXAMPLE.months.reduce((sum, m) => sum + m.units, 0);
const totalSpent = EXAMPLE.months.length * EXAMPLE.monthly;
const avgPrice = totalSpent / totalUnits;
const finalValue = totalUnits * EXAMPLE.months[EXAMPLE.months.length - 1].price;

export default function LearnPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-3xl space-y-10">
        <section className="text-center">
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">เรียนรู้ก่อนลงทุน</p>
          <h1 className="mt-2 text-3xl font-black text-ink md:text-5xl">การลงทุนแบบ DCA<br />อธิบายแบบง่ายที่สุด</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">อ่านจบภายใน 3 นาที แล้วคุณจะเข้าใจทุกอย่างที่ต้องรู้ก่อนเริ่มลงทุน</p>
        </section>

        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-2xl font-bold text-ink">{section.title}</h2>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">{section.body}</p>
          </section>
        ))}

        <section className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6 dark:border-cyan-800 dark:bg-cyan-950">
          <h2 className="text-xl font-bold text-cyan-800 dark:text-cyan-300">ตัวอย่างจริง: DCA เดือนละ {EXAMPLE.monthly.toLocaleString()} บาท</h2>
          <p className="mt-2 text-sm text-cyan-700 dark:text-cyan-400">สมมติซื้อกองทุนที่ราคาขึ้นลงทุกเดือน</p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cyan-200 text-left text-cyan-800 dark:border-cyan-700 dark:text-cyan-300">
                  <th className="py-2 pr-4">เดือน</th>
                  <th className="py-2 pr-4">ราคา/หน่วย</th>
                  <th className="py-2 pr-4">จ่ายเงิน</th>
                  <th className="py-2">ได้หน่วย</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLE.months.map((m) => (
                  <tr key={m.month} className="border-b border-cyan-100 dark:border-cyan-800">
                    <td className="py-2 pr-4 font-medium">{m.month}</td>
                    <td className="py-2 pr-4">{m.price} บาท</td>
                    <td className="py-2 pr-4">{EXAMPLE.monthly.toLocaleString()} บาท</td>
                    <td className="py-2">{m.units.toFixed(1)} หน่วย</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-4 text-center dark:bg-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">ลงทุนทั้งหมด</p>
              <p className="mt-1 text-xl font-bold text-ink">{totalSpent.toLocaleString()} ฿</p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center dark:bg-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">ราคาเฉลี่ยที่ซื้อ</p>
              <p className="mt-1 text-xl font-bold text-ink">{avgPrice.toFixed(1)} ฿/หน่วย</p>
            </div>
            <div className="rounded-2xl bg-white p-4 text-center dark:bg-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">มูลค่า ณ เดือน {EXAMPLE.months[EXAMPLE.months.length - 1].month}</p>
              <p className="mt-1 text-xl font-bold text-emerald-600 dark:text-emerald-400">{Math.round(finalValue).toLocaleString()} ฿</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-cyan-700 dark:text-cyan-400">
            สังเกตว่าเราซื้อได้มากขึ้นตอนราคาถูก (ก.พ. ได้ 37.5 หน่วย) และน้อยลงตอนราคาแพง — นี่คือพลังของ DCA
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink">กฎ 3 ข้อก่อนเริ่มลงทุน</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
              <h3 className="font-bold text-amber-800 dark:text-amber-300">1. เก็บเงินสำรองฉุกเฉินก่อน</h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">มีเงินเก็บ 3-6 เดือนของค่าใช้จ่ายก่อน ถ้ายังไม่มี ให้เก็บส่วนนี้ก่อนเริ่มลงทุน</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
              <h3 className="font-bold text-amber-800 dark:text-amber-300">2. ใช้เงินเย็นเท่านั้น</h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">ลงทุนด้วยเงินที่ไม่ต้องใช้ภายใน 1-3 ปี ห้ามใช้เงินค่าเช่า ค่าอาหาร หรือเงินกู้มาลงทุน</p>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
              <h3 className="font-bold text-amber-800 dark:text-amber-300">3. ปิดหนี้ดอกเบี้ยสูงก่อน</h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">ถ้ามีหนี้บัตรเครดิตหรือหนี้นอกระบบ (ดอกเบี้ย 12%+) ให้ปิดหนี้ก่อน เพราะดอกเบี้ยหนี้สูงกว่าผลตอบแทนลงทุน</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-ink">ศัพท์ที่จะเจอในโปรแกรม</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">ไม่ต้องจำก็ได้ แค่พอรู้ว่ามันคืออะไร</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {TERMS.map((item) => (
              <div key={item.term} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                <p className="font-bold text-ink">{item.term}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.meaning}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-950">
          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">พร้อมแล้ว? เริ่มวางแผนเลย</h2>
          <p className="mt-2 text-emerald-700 dark:text-emerald-400">ตอบคำถามง่ายๆ 4 ขั้นตอน แล้วระบบจะสร้างแผนให้อัตโนมัติ</p>
          <Link
            href="/planner"
            className="mt-5 inline-block rounded-2xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-700"
          >
            เริ่มวางแผน
          </Link>
        </section>
      </div>
    </main>
  );
}
