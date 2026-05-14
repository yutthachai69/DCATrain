'use client';

import Link from 'next/link';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 dark:bg-slate-950">
      <div className="max-w-md text-center">
        <p className="text-6xl font-black text-red-500">ผิดพลาด</p>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-cyan-600 px-6 py-3 font-bold text-white transition hover:bg-cyan-700"
          >
            ลองใหม่
          </button>
          <Link href="/" className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </main>
  );
}
