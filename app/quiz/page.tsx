'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  QUIZ_QUESTIONS,
  QUIZ_LEVELS,
  getQuizLevel,
  loadBestScore,
  saveBestScore,
} from '@/lib/quiz';

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUIZ_QUESTIONS.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setBestScore(loadBestScore());
  }, []);

  const q = QUIZ_QUESTIONS[current];
  const selected = answers[current];
  const isCorrect = selected === q.correctIndex;
  const score = answers.reduce<number>((s, a, i) => s + (a === QUIZ_QUESTIONS[i].correctIndex ? 1 : 0), 0);

  function handleSelect(optionIndex: number) {
    if (revealed) return;
    const newAnswers = [...answers];
    newAnswers[current] = optionIndex;
    setAnswers(newAnswers);
    setRevealed(true);
  }

  function handleNext() {
    setRevealed(false);
    if (current < QUIZ_QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      saveBestScore(score);
      setBestScore(Math.max(bestScore, score));
      setShowResult(true);
    }
  }

  function handleRetry() {
    setCurrent(0);
    setAnswers(Array(QUIZ_QUESTIONS.length).fill(null));
    setShowResult(false);
    setRevealed(false);
  }

  if (showResult) {
    const level = getQuizLevel(score);
    const levelInfo = QUIZ_LEVELS[level];
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="mx-auto max-w-2xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-5xl">{score >= 9 ? '🏆' : score >= 6 ? '🎯' : '📖'}</p>
            <h1 className="mt-4 text-3xl font-black text-ink">ได้ {score}/{QUIZ_QUESTIONS.length} คะแนน</h1>
            <div className={`mt-4 inline-block rounded-full border px-4 py-1.5 text-sm font-bold ${levelInfo.color}`}>
              {levelInfo.label}
            </div>
            {bestScore > 0 && bestScore !== score && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">คะแนนสูงสุดของคุณ: {bestScore}/{QUIZ_QUESTIONS.length}</p>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-ink">เฉลยทุกข้อ</h2>
            {QUIZ_QUESTIONS.map((question, i) => {
              const userAnswer = answers[i];
              const correct = userAnswer === question.correctIndex;
              return (
                <div
                  key={question.id}
                  className={`rounded-2xl border p-5 ${
                    correct
                      ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950'
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                  }`}
                >
                  <p className="text-sm font-bold text-ink">
                    {correct ? '✅' : '❌'} ข้อ {i + 1}: {question.question}
                  </p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    คุณตอบ: {userAnswer !== null ? question.options[userAnswer] : 'ไม่ได้ตอบ'}
                    {!correct && <span className="ml-2 font-semibold text-emerald-700 dark:text-emerald-400">เฉลย: {question.options[question.correctIndex]}</span>}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{question.explanation}</p>
                </div>
              );
            })}
          </section>

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-2xl bg-cyan-600 px-6 py-4 font-bold text-white transition hover:bg-cyan-700"
            >
              ทำใหม่อีกครั้ง
            </button>
            <Link
              href="/learn"
              className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              กลับไปเรียน
            </Link>
            <Link
              href="/planner"
              className="rounded-2xl border border-emerald-300 bg-emerald-50 px-6 py-4 text-center font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
            >
              เริ่มวางแผนลงทุน
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/85">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">ทดสอบความรู้</p>
              <h1 className="mt-1 text-xl font-bold text-ink">ข้อ {current + 1} / {QUIZ_QUESTIONS.length}</h1>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">คะแนนปัจจุบัน</p>
              <p className="text-lg font-bold text-ink">{score}</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-cyan-600 transition-all"
              style={{ width: `${((current + (revealed ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-bold text-ink">{q.question}</h2>
          <div className="mt-4 space-y-3">
            {q.options.map((option, i) => {
              let style = 'border-slate-200 bg-slate-50 hover:border-cyan-300 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-cyan-600';
              if (revealed) {
                if (i === q.correctIndex) {
                  style = 'border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950';
                } else if (i === selected && !isCorrect) {
                  style = 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950';
                } else {
                  style = 'border-slate-200 bg-slate-50 opacity-50 dark:border-slate-600 dark:bg-slate-700/50';
                }
              } else if (i === selected) {
                style = 'border-cyan-300 bg-cyan-50 dark:border-cyan-600 dark:bg-cyan-950';
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={revealed}
                  className={`w-full rounded-xl border p-4 text-left text-sm font-medium transition ${style}`}
                >
                  <span className="mr-2 font-bold text-slate-400">{String.fromCharCode(65 + i)}.</span>
                  {option}
                  {revealed && i === q.correctIndex && <span className="ml-2">✅</span>}
                  {revealed && i === selected && !isCorrect && <span className="ml-2">❌</span>}
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-800 dark:bg-cyan-950">
              <p className="text-sm font-semibold text-cyan-800 dark:text-cyan-300">
                {isCorrect ? '🎉 ถูกต้อง!' : '💡 คำตอบที่ถูกคือ: ' + q.options[q.correctIndex]}
              </p>
              <p className="mt-1 text-sm text-cyan-700 dark:text-cyan-400">{q.explanation}</p>
            </div>
          )}
        </section>

        {revealed && (
          <button
            type="button"
            onClick={handleNext}
            className="w-full rounded-2xl bg-cyan-600 px-6 py-4 text-center font-bold text-white shadow transition hover:bg-cyan-700"
          >
            {current < QUIZ_QUESTIONS.length - 1 ? 'ข้อถัดไป →' : 'ดูผลลัพธ์'}
          </button>
        )}
      </div>
    </main>
  );
}
