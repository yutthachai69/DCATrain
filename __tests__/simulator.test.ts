import { simulateDCA, type SimulationResult } from '@/lib/simulator';

describe('simulateDCA', () => {
  const base = { monthlyAmount: 3000, years: 5, annualReturn: 0.10, inflation: 0.03 };

  it('returns correct total invested', () => {
    const result = simulateDCA(base);
    expect(result.totalInvested).toBe(3000 * 60);
  });

  it('final value is greater than total invested when return > 0', () => {
    const result = simulateDCA(base);
    expect(result.finalValue).toBeGreaterThan(result.totalInvested);
  });

  it('total gain matches final value minus invested', () => {
    const result = simulateDCA(base);
    expect(result.totalGain).toBe(result.finalValue - result.totalInvested);
  });

  it('total gain percent is correct', () => {
    const result = simulateDCA(base);
    const expected = (result.totalGain / result.totalInvested) * 100;
    expect(result.totalGainPercent).toBeCloseTo(expected, 1);
  });

  it('real value accounts for inflation', () => {
    const result = simulateDCA(base);
    const expectedReal = Math.round(result.finalValue / Math.pow(1.03, 5));
    expect(result.realValue).toBe(expectedReal);
  });

  it('real value is less than final value when inflation > 0', () => {
    const result = simulateDCA(base);
    expect(result.realValue).toBeLessThan(result.finalValue);
  });

  it('months array has correct length', () => {
    const result = simulateDCA(base);
    expect(result.months).toHaveLength(60);
  });

  it('months are sequential from 1 to totalMonths', () => {
    const result = simulateDCA(base);
    result.months.forEach((m, i) => {
      expect(m.month).toBe(i + 1);
    });
  });

  it('monthly rate is annualReturn / 12', () => {
    const result = simulateDCA(base);
    expect(result.monthlyReturnRate).toBeCloseTo(0.10 / 12, 10);
  });

  it('returns zero gain when annualReturn is 0', () => {
    const result = simulateDCA({ ...base, annualReturn: 0 });
    expect(result.finalValue).toBe(result.totalInvested);
    expect(result.totalGain).toBe(0);
  });

  it('handles 1-year simulation', () => {
    const result = simulateDCA({ ...base, years: 1 });
    expect(result.months).toHaveLength(12);
    expect(result.totalInvested).toBe(36000);
  });

  it('handles 30-year simulation', () => {
    const result = simulateDCA({ ...base, years: 30 });
    expect(result.months).toHaveLength(360);
    expect(result.finalValue).toBeGreaterThan(result.totalInvested * 2);
  });

  it('yearly labels are correct', () => {
    const result = simulateDCA(base);
    const year1 = result.months[11];
    expect(year1.label).toBe('ปีที่ 1');
    const month5 = result.months[4];
    expect(month5.label).toBe('เดือน 5');
  });

  it('each month value grows monotonically with positive return', () => {
    const result = simulateDCA(base);
    for (let i = 1; i < result.months.length; i++) {
      expect(result.months[i].value).toBeGreaterThan(result.months[i - 1].value);
    }
  });
});
