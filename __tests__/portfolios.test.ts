import { PORTFOLIOS, getPortfolio, RISK_LABELS, RISK_COLORS } from '@/lib/portfolios';
import { ASSETS } from '@/lib/assets';

describe('PORTFOLIOS', () => {
  it('has exactly 3 portfolios', () => {
    expect(PORTFOLIOS).toHaveLength(3);
  });

  it('covers all risk levels', () => {
    const levels = PORTFOLIOS.map(p => p.riskLevel);
    expect(levels).toContain('low');
    expect(levels).toContain('medium');
    expect(levels).toContain('high');
  });

  it('each portfolio items sum to 100%', () => {
    PORTFOLIOS.forEach(p => {
      const total = p.items.reduce((sum, item) => sum + item.percent, 0);
      expect(total).toBe(100);
    });
  });

  it('all asset keys in portfolios exist in ASSETS', () => {
    PORTFOLIOS.forEach(p => {
      p.items.forEach(item => {
        expect(ASSETS[item.assetKey]).toBeDefined();
      });
    });
  });

  it('each portfolio has a slug, name, description', () => {
    PORTFOLIOS.forEach(p => {
      expect(p.slug).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.description.length).toBeGreaterThan(10);
    });
  });

  it('monthly min is a positive number', () => {
    PORTFOLIOS.forEach(p => {
      expect(p.monthlyMin).toBeGreaterThan(0);
    });
  });
});

describe('getPortfolio', () => {
  it('finds portfolio by slug', () => {
    const p = getPortfolio('conservative');
    expect(p).toBeDefined();
    expect(p?.name).toContain('เสี่ยงต่ำ');
  });

  it('returns undefined for unknown slug', () => {
    expect(getPortfolio('nonexistent')).toBeUndefined();
  });
});

describe('RISK_LABELS and RISK_COLORS', () => {
  it('has labels for all risk levels', () => {
    expect(RISK_LABELS.low).toBeTruthy();
    expect(RISK_LABELS.medium).toBeTruthy();
    expect(RISK_LABELS.high).toBeTruthy();
  });

  it('has colors for all risk levels', () => {
    expect(RISK_COLORS.low).toBeTruthy();
    expect(RISK_COLORS.medium).toBeTruthy();
    expect(RISK_COLORS.high).toBeTruthy();
  });
});
