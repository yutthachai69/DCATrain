export type Goal = 'เก็บออมระยะยาว' | 'สร้างรายได้เพิ่ม' | 'เก็บเพื่อเกษียณ' | 'เก็งกำไรระยะสั้น';
export type RiskLevel = 'ต่ำ — ขาดทุนไม่ได้เลย' | 'กลาง — รับได้บ้าง' | 'สูง — รับได้มาก';
export type Horizon = 'น้อยกว่า 1 ปี' | '1–3 ปี' | '3–10 ปี' | '10 ปีขึ้นไป';
export type JobStability = 'พนักงานประจำ' | 'ฟรีแลนซ์/รายได้ไม่แน่นอน' | 'เจ้าของกิจการ';

export const GOALS: Goal[] = ['เก็บออมระยะยาว', 'สร้างรายได้เพิ่ม', 'เก็บเพื่อเกษียณ', 'เก็งกำไรระยะสั้น'];
export const RISK_LEVELS: RiskLevel[] = ['ต่ำ — ขาดทุนไม่ได้เลย', 'กลาง — รับได้บ้าง', 'สูง — รับได้มาก'];
export const HORIZONS: Horizon[] = ['น้อยกว่า 1 ปี', '1–3 ปี', '3–10 ปี', '10 ปีขึ้นไป'];
export const JOB_STABILITIES: JobStability[] = ['พนักงานประจำ', 'ฟรีแลนซ์/รายได้ไม่แน่นอน', 'เจ้าของกิจการ'];

export type PlannerProfile = {
  goal: Goal;
  risk: RiskLevel;
  horizon: Horizon;
  income: number;
  expense: number;
  investmentBudget: number;
  savings: number;
  targetAmount: number;
  debtAmount: number;
  debtRate: number;
  jobStability: JobStability;
  lossTolerance: number;
  experience: number;
};

export type PlannerResult = {
  monthlyInvestment: number;
  emergencyMonths: number;
  requiredEmergencyMonths: number;
  years: number;
  projectedValue: number;
  realProjectedValue: number;
  requiredMonthlyInvestment: number;
  riskScore: number;
  allocationItems: Array<{ label: string; percent: number; color: string }>;
  recommendedAsset: string;
  strategy: string;
  warnings: string[];
};

export const DEFAULT_PROFILE: PlannerProfile = {
  goal: 'เก็บออมระยะยาว',
  risk: 'ต่ำ — ขาดทุนไม่ได้เลย',
  horizon: '1–3 ปี',
  income: 16000,
  expense: 7000,
  investmentBudget: 3000,
  savings: 0,
  targetAmount: 300000,
  debtAmount: 0,
  debtRate: 0,
  jobStability: 'พนักงานประจำ',
  lossTolerance: 1,
  experience: 0,
};

export function createPlan(profile: PlannerProfile): PlannerResult {
  const { goal, risk, horizon, income, expense, investmentBudget, savings, targetAmount, debtAmount, debtRate, jobStability, lossTolerance, experience } = profile;

  const freeCash = Math.max(income - expense, 0);
  const monthlyInvestment = Math.max(Math.min(investmentBudget, freeCash), 0);
  const requiredEmergencyMonths = jobStability === 'พนักงานประจำ' ? 6 : 12;
  const emergencyTarget = expense * requiredEmergencyMonths;
  const emergencyMonths = expense > 0 ? Math.min(savings / expense, 999) : (savings > 0 ? 999 : 0);
  const years = horizon === 'น้อยกว่า 1 ปี' ? 1 : horizon === '1–3 ปี' ? 3 : horizon === '3–10 ปี' ? 7 : 15;
  const riskScore = calculateRiskScore(risk, horizon, jobStability, lossTolerance, experience);
  const expectedReturn = riskScore < 35 ? 0.04 : riskScore < 70 ? 0.07 : 0.1;
  const inflation = 0.03;
  const monthlyRate = expectedReturn / 12;
  const months = years * 12;
  const projectedValue = monthlyRate === 0 ? monthlyInvestment * months : monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const realProjectedValue = projectedValue / Math.pow(1 + inflation, years);
  const requiredMonthlyInvestment = monthlyRate === 0 ? targetAmount / months : targetAmount * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1);
  const allocationItems = getAllocationItems(goal, riskScore, horizon);
  const warnings: string[] = [];

  if (savings < emergencyTarget) warnings.push('เงินสำรองฉุกเฉินยังไม่พอ ควรเก็บให้ได้ 3–6 เดือนก่อนเริ่มลงทุนหนัก');
  if (investmentBudget > freeCash) warnings.push('เงินที่ยอมลงทุนต่อเดือนสูงกว่าเงินเหลือจริงหลังหักค่าใช้จ่าย ระบบจึงคำนวณจากเงินเหลือจริงแทน');
  if (debtAmount > 0 && debtRate >= 12) warnings.push('มีหนี้ดอกเบี้ยสูง ควรเร่งปิดหนี้ก่อนเพิ่มเงินลงทุน เพราะดอกเบี้ยอาจสูงกว่าผลตอบแทนลงทุน');
  if (monthlyInvestment < requiredMonthlyInvestment) warnings.push('เงินลงทุนต่อเดือนตอนนี้ยังไม่พอถึงเป้าหมาย อาจต้องเพิ่มเงินลงทุน เพิ่มระยะเวลา หรือลดเป้าหมายลง');
  if (goal === 'เก็งกำไรระยะสั้น' && risk === 'ต่ำ — ขาดทุนไม่ได้เลย') warnings.push('เป้าหมายเก็งกำไรระยะสั้นขัดกับความเสี่ยงต่ำ ควรเปลี่ยนเป็นเป้าหมายออมระยะสั้นหรือเพิ่มความเสี่ยงที่รับได้');
  if (horizon === 'น้อยกว่า 1 ปี' && risk === 'สูง — รับได้มาก') warnings.push('ระยะเวลาน้อยกว่า 1 ปีไม่เหมาะกับสินทรัพย์เสี่ยงสูง เพราะราคาผันผวนมาก');
  if (expense >= income) warnings.push('ค่าใช้จ่ายเท่ากับหรือมากกว่าเงินเดือน ควรลดรายจ่ายหรือเพิ่มรายได้ก่อนลงทุน');

  return {
    monthlyInvestment,
    emergencyMonths,
    requiredEmergencyMonths,
    years,
    projectedValue,
    realProjectedValue,
    requiredMonthlyInvestment,
    riskScore,
    allocationItems,
    recommendedAsset: getRecommendedAsset(goal, risk, horizon),
    strategy: savings >= emergencyTarget && freeCash > 0
      ? 'ทยอยซื้อทุกเดือนจำนวนเท่ากัน (DCA) เพื่อไม่ต้องเดาราคา ถ้ามีเงินก้อนให้แบ่งเป็น 3–6 ไม้'
      : 'เริ่มจากกันเงินสำรองฉุกเฉินก่อน แล้วค่อย DCA ด้วยเงินส่วนที่เหลือจริง',
    warnings,
  };
}

export function calculateRiskScore(risk: RiskLevel, horizon: Horizon, jobStability: JobStability, lossTolerance: number, experience: number) {
  const riskBase = risk === 'ต่ำ — ขาดทุนไม่ได้เลย' ? 20 : risk === 'กลาง — รับได้บ้าง' ? 50 : 75;
  const horizonBonus = horizon === 'น้อยกว่า 1 ปี' ? -20 : horizon === '1–3 ปี' ? -5 : horizon === '3–10 ปี' ? 10 : 20;
  const jobPenalty = jobStability === 'พนักงานประจำ' ? 0 : -10;
  const behaviorBonus = lossTolerance * 8 + experience * 5;
  return Math.min(Math.max(riskBase + horizonBonus + jobPenalty + behaviorBonus, 0), 100);
}

function getAllocationItems(goal: Goal, riskScore: number, horizon: Horizon) {
  if (horizon === 'น้อยกว่า 1 ปี') {
    return [
      { label: 'เงินสด/ตลาดเงิน', percent: 80, color: '#64748b' },
      { label: 'ทองคำ', percent: 20, color: '#f59e0b' },
    ];
  }
  if (riskScore < 35) {
    return [
      { label: 'เงินสด/ตราสารหนี้', percent: 25, color: '#64748b' },
      { label: 'S&P 500', percent: 50, color: '#0891b2' },
      { label: 'ทองคำ', percent: 25, color: '#f59e0b' },
    ];
  }
  if (riskScore < 70) {
    return [
      { label: 'S&P 500', percent: 50, color: '#0891b2' },
      { label: 'หุ้นไทย/หุ้นคุณภาพ', percent: 20, color: '#16a34a' },
      { label: 'ทองคำ', percent: 20, color: '#f59e0b' },
      { label: 'Crypto', percent: goal === 'เก็งกำไรระยะสั้น' ? 10 : 10, color: '#8b5cf6' },
    ];
  }
  return [
    { label: 'S&P 500', percent: 45, color: '#0891b2' },
    { label: 'หุ้นเติบโต/หุ้นคุณภาพ', percent: 25, color: '#16a34a' },
    { label: 'Crypto', percent: goal === 'เก็งกำไรระยะสั้น' ? 20 : 15, color: '#8b5cf6' },
    { label: 'ทองคำ', percent: goal === 'เก็งกำไรระยะสั้น' ? 10 : 15, color: '#f59e0b' },
  ];
}

function getRecommendedAsset(goal: Goal, risk: RiskLevel, horizon: Horizon) {
  if (horizon === 'น้อยกว่า 1 ปี') return 'ทอง';
  if (risk === 'ต่ำ — ขาดทุนไม่ได้เลย') return 'S&P500';
  if (risk === 'กลาง — รับได้บ้าง') return goal === 'สร้างรายได้เพิ่ม' ? 'PTT.BK' : 'S&P500';
  if (goal === 'เก็งกำไรระยะสั้น') return 'BTC';
  return 'AAPL';
}

export type PersonalizedAdvice = {
  topPicks: Array<{
    assetKey: string;
    reason: string;
    suggestedMonthly: number;
    percent: number;
  }>;
  timeline: string;
  monthlyBreakdown: string;
  keyAdvice: string[];
  riskWarning: string;
};

export function generatePersonalizedAdvice(
  profile: PlannerProfile,
  plan: PlannerResult,
): PersonalizedAdvice {
  const { goal, risk, horizon } = profile;
  const { monthlyInvestment, riskScore, years } = plan;

  const picks: PersonalizedAdvice['topPicks'] = [];
  const keyAdvice: string[] = [];

  if (riskScore < 35) {
    picks.push(
      { assetKey: 'S&P500', reason: 'ดัชนี 500 บริษัทใหญ่สุดในสหรัฐ กระจายความเสี่ยงดี เหมาะมือใหม่', suggestedMonthly: 0, percent: 40 },
      { assetKey: 'ทอง', reason: 'สินทรัพย์ปลอดภัยช่วยป้องกันเงินเฟ้อ ราคาไม่ผันผวนมาก', suggestedMonthly: 0, percent: 30 },
      { assetKey: 'TMBGOLDS', reason: 'กองทุนทองคำซื้อง่ายผ่านแอปธนาคาร ไม่ต้องเก็บทองจริง', suggestedMonthly: 0, percent: 20 },
      { assetKey: 'K-US500X', reason: 'กองทุน S&P500 ของ KBank DCA ผ่าน K PLUS เริ่ม 500 บาท', suggestedMonthly: 0, percent: 10 },
    );
  } else if (riskScore < 70) {
    picks.push(
      { assetKey: 'S&P500', reason: 'แกนหลักของพอร์ต ผลตอบแทนเฉลี่ย 10% ต่อปี', suggestedMonthly: 0, percent: 35 },
      { assetKey: 'BTC', reason: 'Crypto อันดับ 1 ผันผวนแต่ให้ผลตอบแทนสูงในระยะยาว', suggestedMonthly: 0, percent: 15 },
      { assetKey: 'ทอง', reason: 'ช่วยลดความผันผวนของพอร์ตเมื่อตลาดหุ้นลง', suggestedMonthly: 0, percent: 15 },
    );
    if (goal === 'สร้างรายได้เพิ่ม') {
      picks.push(
        { assetKey: 'PTT.BK', reason: 'หุ้นปันผลดี จ่ายทุกปี เหมาะสร้างรายได้', suggestedMonthly: 0, percent: 20 },
        { assetKey: 'SCB.BK', reason: 'หุ้นธนาคารใหญ่ปันผลสม่ำเสมอ', suggestedMonthly: 0, percent: 15 },
      );
    } else {
      picks.push(
        { assetKey: 'AAPL', reason: 'บริษัทเทคโนโลยีที่ใหญ่ที่สุดในโลก เติบโตต่อเนื่อง', suggestedMonthly: 0, percent: 20 },
        { assetKey: 'CPALL.BK', reason: 'เจ้าของ 7-Eleven ในไทย รายได้มั่นคง', suggestedMonthly: 0, percent: 15 },
      );
    }
  } else {
    picks.push(
      { assetKey: 'BTC', reason: 'Crypto อันดับ 1 ผลตอบแทนสูงสุดในสินทรัพย์ดิจิทัล', suggestedMonthly: 0, percent: 25 },
      { assetKey: 'ETH', reason: 'Blockchain อันดับ 2 มี use case จริง DeFi, NFT, Smart Contract', suggestedMonthly: 0, percent: 15 },
      { assetKey: 'S&P500', reason: 'แกนหลักที่ช่วยกระจายความเสี่ยง', suggestedMonthly: 0, percent: 25 },
      { assetKey: 'MSFT', reason: 'รายได้จาก Cloud + AI เติบโตต่อเนื่อง', suggestedMonthly: 0, percent: 15 },
      { assetKey: 'ทอง', reason: 'ลดความผันผวนของพอร์ต', suggestedMonthly: 0, percent: 10 },
    );
    if (goal === 'เก็งกำไรระยะสั้น') {
      picks.push(
        { assetKey: 'SOL', reason: 'Blockchain เร็ว ค่าธรรมเนียมถูก เป็นคู่แข่ง ETH', suggestedMonthly: 0, percent: 10 },
      );
    } else {
      picks.push(
        { assetKey: 'TSLA', reason: 'ผู้นำ EV + AI ราคาผันผวนแต่มี upside สูง', suggestedMonthly: 0, percent: 10 },
      );
    }
  }

  for (const pick of picks) {
    pick.suggestedMonthly = Math.round((monthlyInvestment * pick.percent) / 100);
  }

  if (profile.savings < profile.expense * plan.requiredEmergencyMonths) {
    keyAdvice.push(`เก็บเงินสำรองฉุกเฉินให้ได้ ${plan.requiredEmergencyMonths} เดือนก่อน (${formatSimple(profile.expense * plan.requiredEmergencyMonths)} บาท) แล้วค่อยเพิ่มเงินลงทุน`);
  }
  if (profile.debtAmount > 0 && profile.debtRate >= 12) {
    keyAdvice.push('เร่งปิดหนี้ดอกเบี้ยสูงก่อน เพราะดอกเบี้ยหนี้มากกว่าผลตอบแทนลงทุน');
  }
  keyAdvice.push(`ตั้ง DCA อัตโนมัติทุกวันที่ 1 หรือวันเงินเดือนออก อย่าข้ามเดือน`);
  keyAdvice.push('ปีแรกไม่ต้องดูผลตอบแทนบ่อย ดูไตรมาสละครั้งก็พอ');
  if (horizon === '3–10 ปี' || horizon === '10 ปีขึ้นไป') {
    keyAdvice.push('ระยะยาวยิ่งดี ยิ่ง DCA นานยิ่งลดความเสี่ยงจากจังหวะ');
  }
  if (risk === 'สูง — รับได้มาก') {
    keyAdvice.push('พอร์ตเสี่ยงสูงอาจติดลบ 20-40% ในปีแย่ — ถ้าใจไม่นิ่งอาจต้องลดสัดส่วน Crypto ลง');
  }

  const expectedReturnAdv = riskScore < 35 ? 0.04 : riskScore < 70 ? 0.07 : 0.1;
  const monthlyRateAdv = expectedReturnAdv / 12;
  const targetYears = profile.targetAmount > 0 && monthlyInvestment > 0 && monthlyRateAdv > 0
    ? Math.ceil(Math.log(1 + (profile.targetAmount * monthlyRateAdv) / monthlyInvestment) / (12 * Math.log(1 + monthlyRateAdv)))
    : years;

  const timeline = profile.targetAmount > 0
    ? `ด้วยเงินลงทุนเดือนละ ${formatSimple(monthlyInvestment)} บาท คาดว่าจะถึงเป้าหมาย ${formatSimple(profile.targetAmount)} บาท ภายในประมาณ ${targetYears} ปี`
    : `ด้วยเงินลงทุนเดือนละ ${formatSimple(monthlyInvestment)} บาท ใน ${years} ปี คาดว่าจะมีเงินประมาณ ${formatSimple(Math.round(plan.projectedValue))} บาท`;

  const monthlyBreakdown = picks
    .map((p) => `${p.assetKey}: ${formatSimple(p.suggestedMonthly)} บาท/เดือน (${p.percent}%)`)
    .join(' · ');

  const riskWarning = riskScore < 35
    ? 'พอร์ตนี้เน้นความมั่นคง ผลตอบแทนอาจไม่สูงแต่ขาดทุนน้อย เหมาะกับคนที่ต้องการความปลอดภัย'
    : riskScore < 70
      ? 'พอร์ตนี้สมดุลระหว่างการเติบโตและความเสี่ยง อาจขาดทุน 10-20% ในปีที่ตลาดลง แต่ระยะยาว 5+ ปีมักได้ผลตอบแทนดี'
      : 'พอร์ตนี้เน้นผลตอบแทนสูง แต่ความผันผวนสูงมาก อาจขาดทุน 30-50% ในช่วงตลาดลง ต้องอดทนและมีเวลา 7+ ปี';

  return { topPicks: picks, timeline, monthlyBreakdown, keyAdvice, riskWarning };
}

function formatSimple(n: number): string {
  return n.toLocaleString('th-TH', { maximumFractionDigits: 0 });
}

const STORAGE_KEY = 'investment-planner-profile';

export function loadProfile(): Partial<PlannerProfile> | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as Partial<PlannerProfile>;
  } catch {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* SSR safe */ }
    return null;
  }
}

export function saveProfile(profile: PlannerProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
