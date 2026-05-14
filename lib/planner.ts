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
  const emergencyMonths = expense > 0 ? savings / expense : 6;
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
      { label: 'S&P 500', percent: 55, color: '#0891b2' },
      { label: 'หุ้นไทย/หุ้นคุณภาพ', percent: 20, color: '#16a34a' },
      { label: 'ทองคำ', percent: 15, color: '#f59e0b' },
      { label: 'Crypto', percent: goal === 'เก็งกำไรระยะสั้น' ? 10 : 5, color: '#8b5cf6' },
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

const STORAGE_KEY = 'investment-planner-profile';

export function loadProfile(): Partial<PlannerProfile> | null {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved) as Partial<PlannerProfile>;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveProfile(profile: PlannerProfile) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
