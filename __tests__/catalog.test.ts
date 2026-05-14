import { CATEGORIES, getCategory } from '@/lib/catalog';
import { ASSETS } from '@/lib/assets';

describe('CATEGORIES', () => {
  it('has 7 categories', () => {
    expect(CATEGORIES).toHaveLength(7);
  });

  it('each category has required fields', () => {
    CATEGORIES.forEach(c => {
      expect(c.slug).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(c.shortName).toBeTruthy();
      expect(c.description.length).toBeGreaterThan(10);
      expect(c.riskLevel).toBeTruthy();
      expect(c.suitableFor).toBeTruthy();
      expect(c.beginnerPick).toBeTruthy();
      expect(c.icon).toBeTruthy();
    });
  });

  it('each beginnerPick exists in ASSETS', () => {
    CATEGORIES.forEach(c => {
      expect(ASSETS[c.beginnerPick]).toBeDefined();
    });
  });

  it('each category slug is unique', () => {
    const slugs = CATEGORIES.map(c => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('getCategory', () => {
  it('finds category by slug', () => {
    const c = getCategory('crypto');
    expect(c).toBeDefined();
    expect(c?.name).toContain('คริปโต');
  });

  it('returns undefined for unknown slug', () => {
    expect(getCategory('nonexistent')).toBeUndefined();
  });
});
