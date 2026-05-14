export type SimulationInput = {
  monthlyAmount: number;
  years: number;
  annualReturn: number;
  inflation: number;
};

export type SimulationMonth = {
  month: number;
  label: string;
  invested: number;
  value: number;
  gain: number;
  gainPercent: number;
};

export type SimulationResult = {
  months: SimulationMonth[];
  totalInvested: number;
  finalValue: number;
  totalGain: number;
  totalGainPercent: number;
  realValue: number;
  monthlyReturnRate: number;
};

export function simulateDCA(input: SimulationInput): SimulationResult {
  const { monthlyAmount, years, annualReturn, inflation } = input;
  const totalMonths = years * 12;
  const monthlyRate = annualReturn / 12;
  const months: SimulationMonth[] = [];

  let value = 0;
  for (let i = 1; i <= totalMonths; i++) {
    value = (value + monthlyAmount) * (1 + monthlyRate);
    const invested = monthlyAmount * i;
    const gain = value - invested;

    months.push({
      month: i,
      label: i % 12 === 0 ? `ปีที่ ${i / 12}` : `เดือน ${i}`,
      invested,
      value: Math.round(value),
      gain: Math.round(gain),
      gainPercent: invested > 0 ? (gain / invested) * 100 : 0,
    });
  }

  const totalInvested = monthlyAmount * totalMonths;
  const finalValue = Math.round(value);
  const totalGain = finalValue - totalInvested;
  const realValue = Math.round(finalValue / Math.pow(1 + inflation, years));

  return {
    months,
    totalInvested,
    finalValue,
    totalGain,
    totalGainPercent: totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0,
    realValue,
    monthlyReturnRate: monthlyRate,
  };
}

export const RETURN_PRESETS = [
  { label: 'เงินฝาก (1.5%)', value: 0.015 },
  { label: 'ตราสารหนี้ (3%)', value: 0.03 },
  { label: 'ทองคำ (8%)', value: 0.08 },
  { label: 'S&P 500 (10%)', value: 0.10 },
  { label: 'หุ้นเติบโต (15%)', value: 0.15 },
  { label: 'Crypto (30%)', value: 0.30 },
] as const;
