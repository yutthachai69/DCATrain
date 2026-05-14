import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-5 py-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
          <p className="font-semibold">คำเตือน: การลงทุนมีความเสี่ยง</p>
          <p className="mt-1 text-xs leading-relaxed">
            ข้อมูลในเว็บไซต์นี้จัดทำเพื่อการศึกษาเท่านั้น ไม่ใช่คำแนะนำในการลงทุน ผลตอบแทนในอดีตไม่ได้รับประกันผลตอบแทนในอนาคต
            ผู้ลงทุนควรศึกษาข้อมูลและทำความเข้าใจก่อนตัดสินใจลงทุน และควรลงทุนด้วยเงินที่ยอมขาดทุนได้เท่านั้น
          </p>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Image src="/LogoDCA.png" alt="DCA Logo" width={32} height={32} className="h-8 w-8" />
              <p className="font-bold text-ink">DCA</p>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">เครื่องมือวางแผนการลงทุนแบบ DCA สำหรับมือใหม่ ฟรี 100%</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">เครื่องมือ</p>
            <nav className="mt-2 flex flex-col gap-1 text-xs">
              <Link href="/planner" className="text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">วางแผน</Link>
              <Link href="/analyzer" className="text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">วิเคราะห์</Link>
              <Link href="/simulator" className="text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">จำลอง DCA</Link>
              <Link href="/explore" className="text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">สำรวจสินทรัพย์</Link>
            </nav>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">เรียนรู้</p>
            <nav className="mt-2 flex flex-col gap-1 text-xs">
              <Link href="/learn" className="text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">DCA คืออะไร</Link>
              <Link href="/portfolios" className="text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">พอร์ตแนะนำ</Link>
              <Link href="/how-to-buy" className="text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400">วิธีซื้อ</Link>
            </nav>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 text-center text-xs text-slate-400 dark:border-slate-800">
          <p>ข้อมูลทั้งหมดเก็บในเครื่องของคุณเท่านั้น (localStorage) ไม่มีการเก็บข้อมูลบน server</p>
        </div>
      </div>
    </footer>
  );
}
