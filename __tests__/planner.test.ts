import {
  createPlan,
  calculateRiskScore,
  DEFAULT_PROFILE,
  type PlannerProfile,
} from '@/lib/planner';

describe('calculateRiskScore', () => {
  it('low risk, short horizon, freelancer = low score', () => {
    const score = calculateRiskScore(
      'ต่ำ — ขาดทุนไม่ได้เลย', 'น้อยกว่า 1 ปี', 'ฟรีแลนซ์/รายได้ไม่แน่นอน', 0, 0,
    );
    expect(score).toBeLessThanOrEqual(10);
    expect(score).toBeGreaterThanOrEqual(0);
  });

  it('high risk, long horizon, experienced = high score', () => {
    const score = calculateRiskScore(
      'สูง — รับได้มาก', '10 ปีขึ้นไป', 'พนักงานประจำ', 5, 5,
    );
    expect(score).toBeGreaterThanOrEqual(80);
  });

  it('score is clamped between 0 and 100', () => {
    const low = calculateRiskScore('ต่ำ — ขาดทุนไม่ได้เลย', 'น้อยกว่า 1 ปี', 'ฟรีแลนซ์/รายได้ไม่แน่นอน', 0, 0);
    const high = calculateRiskScore('สูง — รับได้มาก', '10 ปีขึ้นไป', 'พนักงานประจำ', 10, 10);
    expect(low).toBeGreaterThanOrEqual(0);
    expect(high).toBeLessThanOrEqual(100);
  });

  it('medium risk scores between low and high', () => {
    const low = calculateRiskScore('ต่ำ — ขาดทุนไม่ได้เลย', '3–10 ปี', 'พนักงานประจำ', 2, 2);
    const mid = calculateRiskScore('กลาง — รับได้บ้าง', '3–10 ปี', 'พนักงานประจำ', 2, 2);
    const high = calculateRiskScore('สูง — รับได้มาก', '3–10 ปี', 'พนักงานประจำ', 2, 2);
    expect(mid).toBeGreaterThan(low);
    expect(mid).toBeLessThan(high);
  });
});

describe('createPlan', () => {
  it('returns all required fields', () => {
    const plan = createPlan(DEFAULT_PROFILE);
    expect(plan).toHaveProperty('monthlyInvestment');
    expect(plan).toHaveProperty('emergencyMonths');
    expect(plan).toHaveProperty('riskScore');
    expect(plan).toHaveProperty('projectedValue');
    expect(plan).toHaveProperty('allocationItems');
    expect(plan).toHaveProperty('recommendedAsset');
    expect(plan).toHaveProperty('strategy');
    expect(plan).toHaveProperty('warnings');
  });

  it('monthly investment does not exceed free cash', () => {
    const profile: PlannerProfile = { ...DEFAULT_PROFILE, income: 10000, expense: 8000, investmentBudget: 5000 };
    const plan = createPlan(profile);
    expect(plan.monthlyInvestment).toBeLessThanOrEqual(2000);
  });

  it('warns when savings below emergency target', () => {
    const profile: PlannerProfile = { ...DEFAULT_PROFILE, savings: 0, expense: 10000 };
    const plan = createPlan(profile);
    expect(plan.warnings.some(w => w.includes('สำรองฉุกเฉิน'))).toBe(true);
  });

  it('warns when high-interest debt exists', () => {
    const profile: PlannerProfile = { ...DEFAULT_PROFILE, debtAmount: 100000, debtRate: 15 };
    const plan = createPlan(profile);
    expect(plan.warnings.some(w => w.includes('หนี้ดอกเบี้ยสูง'))).toBe(true);
  });

  it('warns when expense >= income', () => {
    const profile: PlannerProfile = { ...DEFAULT_PROFILE, income: 10000, expense: 10000 };
    const plan = createPlan(profile);
    expect(plan.warnings.some(w => w.includes('ค่าใช้จ่ายเท่ากับ'))).toBe(true);
  });

  it('warns when short-term + low-risk conflict', () => {
    const profile: PlannerProfile = {
      ...DEFAULT_PROFILE,
      goal: 'เก็งกำไรระยะสั้น',
      risk: 'ต่ำ — ขาดทุนไม่ได้เลย',
    };
    const plan = createPlan(profile);
    expect(plan.warnings.some(w => w.includes('ขัดกับ'))).toBe(true);
  });

  it('recommends gold for short horizon', () => {
    const profile: PlannerProfile = { ...DEFAULT_PROFILE, horizon: 'น้อยกว่า 1 ปี' };
    const plan = createPlan(profile);
    expect(plan.recommendedAsset).toBe('ทอง');
  });

  it('recommends S&P500 for low risk', () => {
    const profile: PlannerProfile = { ...DEFAULT_PROFILE, risk: 'ต่ำ — ขาดทุนไม่ได้เลย', horizon: '3–10 ปี' };
    const plan = createPlan(profile);
    expect(plan.recommendedAsset).toBe('S&P500');
  });

  it('allocations sum to ~100%', () => {
    const plan = createPlan(DEFAULT_PROFILE);
    const total = plan.allocationItems.reduce((sum, item) => sum + item.percent, 0);
    expect(total).toBeGreaterThanOrEqual(95);
    expect(total).toBeLessThanOrEqual(105);
  });

  it('projected value > 0 when monthlyInvestment > 0', () => {
    const plan = createPlan(DEFAULT_PROFILE);
    expect(plan.projectedValue).toBeGreaterThan(0);
  });

  it('real projected value < projected value due to inflation', () => {
    const profile: PlannerProfile = { ...DEFAULT_PROFILE, horizon: '10 ปีขึ้นไป' };
    const plan = createPlan(profile);
    expect(plan.realProjectedValue).toBeLessThan(plan.projectedValue);
  });

  it('freelancer requires 12 months emergency', () => {
    const profile: PlannerProfile = { ...DEFAULT_PROFILE, jobStability: 'ฟรีแลนซ์/รายได้ไม่แน่นอน' };
    const plan = createPlan(profile);
    expect(plan.requiredEmergencyMonths).toBe(12);
  });
});
