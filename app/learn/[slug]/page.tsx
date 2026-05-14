import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { LESSONS, getLesson } from '@/lib/lessons';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const lesson = getLesson(params.slug);
  if (!lesson) return {};
  return {
    title: `${lesson.title} — เรียนรู้การลงทุน`,
    description: lesson.subtitle,
  };
}

export default function LessonPage({ params }: Props) {
  const lesson = getLesson(params.slug);
  if (!lesson) notFound();

  const currentIndex = LESSONS.findIndex((l) => l.slug === params.slug);
  const prev = currentIndex > 0 ? LESSONS[currentIndex - 1] : null;
  const next = currentIndex < LESSONS.length - 1 ? LESSONS[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-3xl space-y-6">
        <Link href="/learn" className="inline-flex items-center gap-1 text-sm text-cyan-700 transition hover:text-cyan-800 dark:text-cyan-400">
          ← กลับหน้าบทเรียน
        </Link>

        <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <span className="text-4xl">{lesson.icon}</span>
          <h1 className="mt-3 text-2xl font-bold text-ink md:text-3xl">{lesson.title}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{lesson.subtitle}</p>
          <p className="mt-2 text-xs text-slate-400">อ่านประมาณ {lesson.readTime}</p>
        </header>

        {lesson.sections.map((section, i) => (
          <section
            key={i}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800"
          >
            <h2 className="text-lg font-bold text-ink">{section.heading}</h2>
            <div className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600 dark:text-slate-400">
              {section.content}
            </div>
            {section.example && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">ตัวอย่าง</p>
                <pre className="mt-2 whitespace-pre-line text-sm text-slate-700 dark:text-slate-300">
                  {section.example}
                </pre>
              </div>
            )}
            {section.tip && (
              <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950">
                <p className="text-xs font-semibold text-cyan-700 dark:text-cyan-400">💡 เคล็ดลับ</p>
                <p className="mt-1 text-sm text-cyan-700 dark:text-cyan-400">{section.tip}</p>
              </div>
            )}
          </section>
        ))}

        <nav className="flex justify-between gap-4">
          {prev ? (
            <Link
              href={`/learn/${prev.slug}`}
              className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-600"
            >
              <p className="text-xs text-slate-400">← บทก่อนหน้า</p>
              <p className="mt-1 font-bold text-ink">{prev.title}</p>
            </Link>
          ) : <div className="flex-1" />}
          {next ? (
            <Link
              href={`/learn/${next.slug}`}
              className="flex-1 rounded-2xl border border-slate-200 bg-white p-4 text-right transition hover:border-cyan-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-cyan-600"
            >
              <p className="text-xs text-slate-400">บทถัดไป →</p>
              <p className="mt-1 font-bold text-ink">{next.title}</p>
            </Link>
          ) : (
            <Link
              href="/quiz"
              className="flex-1 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-right transition hover:border-emerald-300 dark:border-emerald-800 dark:bg-emerald-950 dark:hover:border-emerald-600"
            >
              <p className="text-xs text-emerald-600 dark:text-emerald-400">เรียนจบแล้ว! →</p>
              <p className="mt-1 font-bold text-emerald-700 dark:text-emerald-300">ทดสอบความรู้</p>
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
