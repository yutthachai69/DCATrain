'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import StepIndicator from '@/components/ui/StepIndicator';
import ChipGroup from '@/components/ui/ChipGroup';
import NumberInput from '@/components/ui/NumberInput';
import NumberSelect from '@/components/ui/NumberSelect';
import Metric from '@/components/ui/Metric';
import AllocationChart from '@/components/ui/AllocationChart';
import {
  type PlannerProfile,
  type RiskLevel,
  GOALS, RISK_LEVELS, HORIZONS, JOB_STABILITIES,
  DEFAULT_PROFILE,
  createPlan,
  generatePersonalizedAdvice,
  loadProfile,
  saveProfile,
} from '@/lib/planner';
import { ASSETS, TAG_CONFIG } from '@/lib/assets';
import { formatBaht } from '@/lib/format';
import { PORTFOLIOS, RISK_LABELS, RISK_COLORS } from '@/lib/portfolios';

const STEP_LABELS = ['เป้าหมาย', 'ความเสี่ยง', 'การเงิน', 'แผนของคุณ'];

export default function PlannerPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<PlannerProfile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) {
      setProfile((prev) => ({ ...prev, ...saved }));
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const timer = setTimeout(() => saveProfile(profile), 500);
    return () => clearTimeout(timer);
  }, [profile, loaded]);

  const plan = useMemo(() => createPlan(profile), [profile]);
  const advice = useMemo(() => generatePersonalizedAdvice(profile, plan), [profile, plan]);

  const update = <K extends keyof PlannerProfile>(key: K, value: PlannerProfile[K]) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const canGoNext = step < 3;
  const canGoBack = step > 0;

  if (!loaded) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/85">
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">ขั้นตอนที่ {step + 1} จาก 4</p>
          <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">วางแผนการลงทุนของคุณ</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {step === 0 && 'เริ่มจากบอกเป้าหมายและระยะเวลาที่คุณต้องการ'}
            {step === 1 && 'ช่วยให้เราเข้าใจว่าคุณรับความเสี่ยงได้แค่ไหน'}
            {step === 2 && 'กรอกข้อมูลเงินคร่าวๆ ระบบจะคำนวณให้'}
            {step === 3 && 'นี่คือแผนที่เราแนะนำสำหรับคุณ'}
          </p>
          <div className="mt-5">
            <StepIndicator steps={STEP_LABELS} current={step} />
          </div>
        </section>

        {step === 0 && (
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <ChipGroup
              title="เป้าหมายของคุณคืออะไร?"
              description="เลือกอันที่ตรงกับคุณมากที่สุด"
              items={GOALS}
              value={profile.goal}
              onChange={(v) => update('goal', v)}
            />
            <ChipGroup
              title="วางแผนลงทุนนานแค่ไหน?"
              description="ยิ่งนาน ยิ่งรับความผันผวนได้มากขึ้น"
              items={HORIZONS}
              value={profile.horizon}
              onChange={(v) => update('horizon', v)}
            />

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              <p className="font-semibold">ทำไมต้องตอบ?</p>
              <p className="mt-1">เป้าหมายและระยะเวลาจะกำหนดว่าควรเลือกสินทรัพย์ประเภทไหน — ถ้าเก็บระยะสั้นจะแนะนำสินทรัพย์ที่ปลอดภัย ถ้าระยะยาวจะแนะนำสินทรัพย์ที่เติบโตได้</p>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <ChipGroup
              title="รับความเสี่ยงได้แค่ไหน?"
              description="ถ้าไม่แน่ใจ เลือก 'กลาง' ได้"
              items={RISK_LEVELS}
              value={profile.risk}
              onChange={(v) => update('risk', v)}
            />

            <RiskExplainer investmentBudget={profile.investmentBudget} risk={profile.risk} />

            <ChipGroup
              title="รายได้มั่นคงแค่ไหน?"
              description="คนที่รายได้ไม่แน่นอนควรเก็บสำรองมากขึ้น"
              items={JOB_STABILITIES}
              value={profile.jobStability}
              onChange={(v) => update('jobStability', v)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberSelect
                title="ถ้าพอร์ตติดลบ 20% คุณรับได้ไหม?"
                description="เช่น ลง 10,000 แล้วเหลือ 8,000"
                value={profile.lossTolerance}
                onChange={(v) => update('lossTolerance', v)}
                options={[
                  { label: 'รับไม่ได้เลย', value: 0 },
                  { label: 'เสียใจแต่รับได้', value: 1 },
                  { label: 'รับได้ ลงทุนต่อ', value: 2 },
                ]}
              />
              <NumberSelect
                title="ประสบการณ์ลงทุนของคุณ"
                description="ตอบตามจริง ไม่มีถูกผิด"
                value={profile.experience}
                onChange={(v) => update('experience', v)}
                options={[
                  { label: 'ยังไม่เคยลงทุนเลย', value: 0 },
                  { label: 'เคยลงทุนบ้าง', value: 1 },
                  { label: 'ลงทุนสม่ำเสมอ', value: 2 },
                ]}
              />
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              <p className="font-semibold">ทำไมต้องตอบ?</p>
              <p className="mt-1">คำตอบเหล่านี้ช่วยคำนวณ Risk Score ของคุณ — ถ้ารับเสี่ยงได้น้อย ระบบจะแนะนำสินทรัพย์ที่มั่นคงกว่า</p>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div>
              <h2 className="font-semibold text-ink">ข้อมูลการเงินของคุณ</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">กรอกตัวเลขคร่าวๆ ได้ ไม่ต้องตรง 100%</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-600 dark:bg-slate-700/50">
              <div className="space-y-4">
                <NumberInput label="เงินเดือน" hint="รายได้ต่อเดือน" value={profile.income} min={0} step={1000} onChange={(v) => update('income', v)} />
                <NumberInput label="ค่าใช้จ่าย" hint="ต่อเดือน" value={profile.expense} min={0} step={1000} onChange={(v) => update('expense', v)} />
                <NumberInput label="เงินลงทุน/เดือน" hint="ที่ยอมจ่ายได้" value={profile.investmentBudget} min={0} step={1000} onChange={(v) => update('investmentBudget', v)} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-600 dark:bg-slate-700/50">
              <div className="space-y-4">
                <NumberInput label="เงินเก็บสำรอง" hint="ที่มีตอนนี้" value={profile.savings} min={0} step={5000} onChange={(v) => update('savings', v)} />
                <NumberInput label="เป้าหมายเงิน" hint="อยากมีเท่าไหร่" value={profile.targetAmount} min={0} step={50000} onChange={(v) => update('targetAmount', v)} />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-600 dark:bg-slate-700/50">
              <div className="space-y-4">
                <NumberInput label="ยอดหนี้" hint="รวมทุกก้อน" value={profile.debtAmount} min={0} step={10000} onChange={(v) => update('debtAmount', v)} />
                <NumberInput label="ดอกเบี้ย/ปี" hint="เฉลี่ยของหนี้" value={profile.debtRate} min={0} max={100} step={0.5} onChange={(v) => update('debtRate', v)} suffix="%" />
              </div>
            </div>

            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-800 dark:border-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
              <p className="font-semibold">ทำไมต้องกรอก?</p>
              <p className="mt-1">ระบบจะคำนวณว่าคุณลงทุนได้จริงเดือนละเท่าไหร่ มีเงินสำรองพอหรือยัง และต้องลงทุนเดือนละเท่าไหร่ถึงจะถึงเป้า</p>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-4">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-800 dark:bg-emerald-950">
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">แผนสำหรับคุณ</p>
              <h2 className="mt-1 text-2xl font-bold text-emerald-900 dark:text-emerald-200">Risk Score: {plan.riskScore}/100</h2>
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                {plan.riskScore < 35 && 'คุณเหมาะกับการลงทุนแบบอนุรักษ์นิยม เน้นความมั่นคงมากกว่าผลตอบแทน'}
                {plan.riskScore >= 35 && plan.riskScore < 70 && 'คุณรับความเสี่ยงได้ปานกลาง สามารถผสมสินทรัพย์เติบโตกับสินทรัพย์มั่นคงได้'}
                {plan.riskScore >= 70 && 'คุณรับความเสี่ยงได้สูง สามารถลงทุนในสินทรัพย์เติบโตสูงได้ แต่ต้องพร้อมรับความผันผวน'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Metric title="ลงทุนได้ต่อเดือน" value={formatBaht(plan.monthlyInvestment)} />
              <Metric title="เงินสำรองฉุกเฉิน" value={`${plan.emergencyMonths.toFixed(1)} / ${plan.requiredEmergencyMonths} เดือน`} />
              <Metric title={`คาดการณ์ใน ${plan.years} ปี`} value={formatBaht(plan.projectedValue)} />
              <Metric title="มูลค่าเทียบเงินวันนี้" value={formatBaht(plan.realProjectedValue)} />
              <Metric title="ต้องลงทุน/เดือนเพื่อถึงเป้า" value={formatBaht(plan.requiredMonthlyInvestment)} />
              <Metric title="สินทรัพย์ที่แนะนำเริ่มดู" value={plan.recommendedAsset} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <AllocationChart allocation={plan.allocationItems} />
              <div className="rounded-2xl border border-stone-200 bg-white/70 p-5 dark:border-slate-700 dark:bg-slate-800/70">
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">กลยุทธ์ที่แนะนำ</p>
                <p className="mt-3 text-base leading-7 text-ink">{plan.strategy}</p>
              </div>
            </div>

            {plan.warnings.length > 0 && (
              <div className="space-y-2">
                {plan.warnings.map((warning) => (
                  <div key={warning} className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    {warning}
                  </div>
                ))}
              </div>
            )}

            {/* Personalized Advice */}
            <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm dark:border-cyan-800 dark:bg-cyan-950">
              <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">คำแนะนำเฉพาะคุณ</p>
              <p className="mt-2 text-base font-medium text-cyan-900 dark:text-cyan-200">{advice.timeline}</p>
              <p className="mt-1 text-sm text-cyan-700 dark:text-cyan-400">{advice.riskWarning}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="text-lg font-bold text-ink">สินทรัพย์ที่แนะนำสำหรับคุณ</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">จัดสัดส่วนตาม Risk Score ของคุณ · DCA เดือนละ {formatBaht(plan.monthlyInvestment)}</p>
              <div className="mt-4 space-y-3">
                {advice.topPicks.map((pick) => {
                  const asset = ASSETS[pick.assetKey];
                  return (
                    <div key={pick.assetKey} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-lg font-bold text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                        {pick.percent}%
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-bold text-ink">{pick.assetKey}</p>
                          {asset && <span className="text-sm text-slate-500 dark:text-slate-400">{asset.name}</span>}
                          {asset?.tags.includes('beginner') && (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TAG_CONFIG.beginner.color}`}>
                              {TAG_CONFIG.beginner.label}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{pick.reason}</p>
                        <p className="mt-1 text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                          DCA: {formatBaht(pick.suggestedMonthly)}/เดือน
                        </p>
                      </div>
                      <Link
                        href={`/analyzer?asset=${encodeURIComponent(pick.assetKey)}`}
                        className="shrink-0 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-cyan-700"
                      >
                        วิเคราะห์
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {advice.keyAdvice.length > 0 && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm dark:border-amber-800 dark:bg-amber-950">
                <h3 className="font-bold text-amber-800 dark:text-amber-300">สิ่งที่ควรทำก่อนเริ่ม</h3>
                <ul className="mt-3 space-y-2">
                  {advice.keyAdvice.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-amber-700 dark:text-amber-400">
                      <span className="shrink-0 font-bold">{i + 1}.</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(() => {
              const matched = plan.riskScore < 35
                ? PORTFOLIOS.find(p => p.riskLevel === 'low')
                : plan.riskScore < 70
                  ? PORTFOLIOS.find(p => p.riskLevel === 'medium')
                  : PORTFOLIOS.find(p => p.riskLevel === 'high');
              if (!matched) return null;
              return (
                <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 dark:border-violet-800 dark:bg-violet-950">
                  <p className="text-sm font-semibold text-violet-700 dark:text-violet-400">พอร์ตที่เหมาะกับคุณ</p>
                  <div className="mt-2 flex items-center gap-3">
                    <h3 className="text-lg font-bold text-violet-900 dark:text-violet-200">{matched.name}</h3>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${RISK_COLORS[matched.riskLevel]}`}>
                      {RISK_LABELS[matched.riskLevel]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-violet-600 dark:text-violet-400">{matched.subtitle} — ผลตอบแทนคาดหวัง {matched.expectedReturn}</p>
                  <div className="mt-3 flex h-4 overflow-hidden rounded-full">
                    {matched.items.map((item) => (
                      <div key={item.assetKey} style={{ width: `${item.percent}%`, backgroundColor: item.color }} />
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-violet-600 dark:text-violet-400">
                    {matched.items.map((item) => (
                      <span key={item.assetKey}>{item.label} {item.percent}%</span>
                    ))}
                  </div>
                  <Link
                    href="/portfolios"
                    className="mt-3 inline-block rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700"
                  >
                    ดูรายละเอียดพอร์ตนี้
                  </Link>
                </div>
              );
            })()}

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href={`/analyzer?asset=${encodeURIComponent(plan.recommendedAsset)}`}
                className="rounded-2xl bg-cyan-600 px-6 py-4 text-center text-base font-bold text-white shadow-lg transition hover:bg-cyan-700"
              >
                วิเคราะห์ {plan.recommendedAsset}
              </Link>
              <Link
                href="/portfolios"
                className="rounded-2xl border border-violet-300 bg-violet-50 px-6 py-4 text-center text-base font-bold text-violet-700 transition hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950 dark:text-violet-400 dark:hover:bg-violet-900"
              >
                ดูพอร์ตทั้งหมด
              </Link>
              <Link
                href="/how-to-buy"
                className="rounded-2xl border border-emerald-300 bg-emerald-50 px-6 py-4 text-center text-base font-bold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 dark:hover:bg-emerald-900"
              >
                เปิดบัญชีเพื่อเริ่มซื้อ
              </Link>
              <Link
                href="/learn"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-4 text-center text-base font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                เรียนรู้เรื่อง DCA
              </Link>
            </div>
          </section>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={!canGoBack}
            className={`rounded-xl px-6 py-3 text-sm font-semibold transition ${
              canGoBack
                ? 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                : 'cursor-not-allowed text-slate-300 dark:text-slate-600'
            }`}
          >
            ย้อนกลับ
          </button>

          {canGoNext && (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="rounded-xl bg-cyan-600 px-6 py-3 text-sm font-bold text-white shadow transition hover:bg-cyan-700"
            >
              ถัดไป
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

function RiskExplainer({ investmentBudget, risk }: { investmentBudget: number; risk: RiskLevel }) {
  const base = investmentBudget > 0 ? investmentBudget : 10000;

  const scenarios: Record<RiskLevel, { maxLoss: number; maxGain: number; example: string }> = {
    'ต่ำ — ขาดทุนไม่ได้เลย': {
      maxLoss: 0.05,
      maxGain: 0.06,
      example: 'เงินฝาก, ตราสารหนี้, กองทุนตลาดเงิน',
    },
    'กลาง — รับได้บ้าง': {
      maxLoss: 0.20,
      maxGain: 0.15,
      example: 'S&P 500, กองทุนหุ้น, ทองคำ',
    },
    'สูง — รับได้มาก': {
      maxLoss: 0.50,
      maxGain: 0.40,
      example: 'Crypto, หุ้นเติบโต, หุ้นเทค',
    },
  };

  const s = scenarios[risk];
  const lossAmount = Math.round(base * s.maxLoss);
  const gainAmount = Math.round(base * s.maxGain);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">ตัวอย่างความเสี่ยงจริง</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">ถ้าลงทุน {formatBaht(base)} ในสินทรัพย์ระดับนี้</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-center dark:border-red-800 dark:bg-red-950">
          <p className="text-xs text-red-500 dark:text-red-400">กรณีเลวร้าย (ปีที่แย่)</p>
          <p className="mt-1 text-lg font-bold text-red-600 dark:text-red-400">
            เหลือ {formatBaht(base - lossAmount)}
          </p>
          <p className="text-xs text-red-400">ขาดทุน {formatBaht(lossAmount)} (-{(s.maxLoss * 100).toFixed(0)}%)</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center dark:border-emerald-800 dark:bg-emerald-950">
          <p className="text-xs text-emerald-500 dark:text-emerald-400">กรณีดี (ปีที่ดี)</p>
          <p className="mt-1 text-lg font-bold text-emerald-600 dark:text-emerald-400">
            ได้ {formatBaht(base + gainAmount)}
          </p>
          <p className="text-xs text-emerald-400">กำไร {formatBaht(gainAmount)} (+{(s.maxGain * 100).toFixed(0)}%)</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">ตัวอย่างสินทรัพย์: {s.example}</p>
    </div>
  );
}
