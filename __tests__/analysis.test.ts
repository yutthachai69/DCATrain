import { analyzeAsset, addIndicators, PricePoint } from '@/lib/analysis';

function generatePriceData(days: number, basePrice: number, trend: 'up' | 'down' | 'flat' = 'flat'): PricePoint[] {
  const data: PricePoint[] = [];
  let price = basePrice;

  for (let i = 0; i < days; i++) {
    const noise = (Math.random() - 0.5) * basePrice * 0.02;
    if (trend === 'up') price += basePrice * 0.002;
    if (trend === 'down') price -= basePrice * 0.002;
    price += noise;
    price = Math.max(price, 1);

    const date = new Date(2024, 0, 1 + i).toISOString().slice(0, 10);
    data.push({
      date,
      open: price * 0.999,
      high: price * 1.01,
      low: price * 0.99,
      close: price,
      volume: 1000000 + Math.random() * 500000,
    });
  }

  return data;
}

describe('addIndicators', () => {
  const data = generatePriceData(200, 100);

  it('returns same number of data points', () => {
    const enriched = addIndicators(data);
    expect(enriched).toHaveLength(data.length);
  });

  it('ma30 is null for first 29 points', () => {
    const enriched = addIndicators(data);
    for (let i = 0; i < 29; i++) {
      expect(enriched[i].ma30).toBeNull();
    }
    expect(enriched[29].ma30).not.toBeNull();
  });

  it('ma90 is null for first 89 points', () => {
    const enriched = addIndicators(data);
    for (let i = 0; i < 89; i++) {
      expect(enriched[i].ma90).toBeNull();
    }
    expect(enriched[89].ma90).not.toBeNull();
  });

  it('RSI values are between 0 and 100', () => {
    const enriched = addIndicators(data);
    enriched.forEach((point) => {
      if (point.rsi !== null) {
        expect(point.rsi).toBeGreaterThanOrEqual(0);
        expect(point.rsi).toBeLessThanOrEqual(100);
      }
    });
  });

  it('volatility is non-negative when present', () => {
    const enriched = addIndicators(data);
    enriched.forEach((point) => {
      if (point.volatility !== null) {
        expect(point.volatility).toBeGreaterThanOrEqual(0);
      }
    });
  });
});

describe('analyzeAsset', () => {
  it('returns valid analysis for sufficient data', () => {
    const data = generatePriceData(365, 100);
    const result = analyzeAsset(data);

    expect(result).toHaveProperty('signal');
    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('latestPrice');
    expect(result).toHaveProperty('rsi');
    expect(result).toHaveProperty('macd');
    expect(result).toHaveProperty('macdSignal');
    expect(result).toHaveProperty('volatility');
    expect(result).toHaveProperty('ma30');
    expect(result).toHaveProperty('ma90');
    expect(result).toHaveProperty('reasons');
    expect(result).toHaveProperty('cautions');
    expect(result).toHaveProperty('advice');
    expect(result).toHaveProperty('frame');
  });

  it('signal is one of the three valid values', () => {
    const data = generatePriceData(365, 100);
    const result = analyzeAsset(data);

    expect(['ซื้อได้', 'รอก่อน', 'หลีกเลี่ยง']).toContain(result.signal);
  });

  it('RSI is between 0 and 100', () => {
    const data = generatePriceData(365, 50);
    const result = analyzeAsset(data);

    expect(result.rsi).toBeGreaterThanOrEqual(0);
    expect(result.rsi).toBeLessThanOrEqual(100);
  });

  it('advice is a non-empty Thai string', () => {
    const data = generatePriceData(365, 100);
    const result = analyzeAsset(data);

    expect(typeof result.advice).toBe('string');
    expect(result.advice.length).toBeGreaterThan(0);
  });

  it('throws when data is insufficient', () => {
    const data = generatePriceData(50, 100);
    expect(() => analyzeAsset(data)).toThrow();
  });

  it('frame contains enriched data points', () => {
    const data = generatePriceData(365, 100);
    const result = analyzeAsset(data);

    expect(result.frame.length).toBeGreaterThan(0);
    const lastPoint = result.frame[result.frame.length - 1];
    expect(lastPoint.ma30).not.toBeNull();
    expect(lastPoint.ma90).not.toBeNull();
    expect(lastPoint.rsi).not.toBeNull();
    expect(lastPoint.macd).not.toBeNull();
  });
});
