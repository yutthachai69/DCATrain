import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5 dark:bg-slate-950">
      <div className="max-w-md text-center">
        <p className="text-7xl font-black text-slate-300 dark:text-slate-600">404</p>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">ไม่พบหน้าที่คุณต้องการ</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-cyan-600 px-6 py-3 font-bold text-white transition hover:bg-cyan-700"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </main>
  );
}
