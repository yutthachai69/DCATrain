import { formatBaht, formatNumber, formatPercent } from '@/lib/format';

describe('formatNumber', () => {
  it('formats integer with commas', () => {
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('formats decimal with at most 2 places', () => {
    expect(formatNumber(1234.567)).toBe('1,234.57');
  });

  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats negative numbers', () => {
    expect(formatNumber(-5000)).toBe('-5,000');
  });
});

describe('formatBaht', () => {
  it('appends baht symbol', () => {
    expect(formatBaht(1000)).toContain('฿');
  });

  it('rounds to integer', () => {
    expect(formatBaht(1234.7)).toBe('1,235 ฿');
  });

  it('formats zero', () => {
    expect(formatBaht(0)).toBe('0 ฿');
  });
});

describe('formatPercent', () => {
  it('shows + for positive values', () => {
    expect(formatPercent(5.5)).toBe('+5.50%');
  });

  it('shows - for negative values', () => {
    expect(formatPercent(-3.2)).toBe('-3.20%');
  });

  it('returns dash for null', () => {
    expect(formatPercent(null)).toBe('-');
  });

  it('returns dash for NaN', () => {
    expect(formatPercent(NaN)).toBe('-');
  });

  it('formats zero as +0.00%', () => {
    expect(formatPercent(0)).toBe('+0.00%');
  });
});
