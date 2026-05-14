import { BROKERS, getBroker, getBrokerLink, getBrokersByCategory, CATEGORY_LABELS } from '@/lib/brokers';
import { ASSETS, getBrokersForAsset } from '@/lib/assets';

describe('BROKERS', () => {
  it('has at least 5 brokers', () => {
    expect(BROKERS.length).toBeGreaterThanOrEqual(5);
  });

  it('each broker has required fields', () => {
    BROKERS.forEach(b => {
      expect(b.slug).toBeTruthy();
      expect(b.name).toBeTruthy();
      expect(b.url).toMatch(/^https?:\/\//);
      expect(b.signupUrl).toMatch(/^https?:\/\//);
      expect(b.categories.length).toBeGreaterThan(0);
      expect(b.steps.length).toBeGreaterThan(0);
      expect(b.pros.length).toBeGreaterThan(0);
    });
  });

  it('each broker slug is unique', () => {
    const slugs = BROKERS.map(b => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('getBroker', () => {
  it('finds broker by slug', () => {
    const b = getBroker('bitkub');
    expect(b).toBeDefined();
    expect(b?.name).toBe('Bitkub');
  });

  it('returns undefined for unknown slug', () => {
    expect(getBroker('nonexistent')).toBeUndefined();
  });
});

describe('getBrokerLink', () => {
  it('returns signupUrl when no affiliateTag', () => {
    const broker = BROKERS.find(b => !b.affiliateTag);
    if (broker) {
      expect(getBrokerLink(broker)).toBe(broker.signupUrl);
    }
  });

  it('returns signupUrl + affiliateTag when present', () => {
    const broker = { ...BROKERS[0], affiliateTag: '?ref=TEST' };
    expect(getBrokerLink(broker)).toBe(`${broker.signupUrl}?ref=TEST`);
  });
});

describe('getBrokersForAsset', () => {
  it('returns brokers for BTC', () => {
    const brokers = getBrokersForAsset('BTC');
    expect(brokers.length).toBeGreaterThan(0);
    expect(brokers.every(b => b.slug)).toBe(true);
  });

  it('returns empty for unknown asset', () => {
    expect(getBrokersForAsset('UNKNOWN')).toEqual([]);
  });
});

describe('getBrokersByCategory', () => {
  it('returns crypto brokers', () => {
    const brokers = getBrokersByCategory('crypto');
    expect(brokers.length).toBeGreaterThan(0);
    brokers.forEach(b => {
      expect(b.categories).toContain('crypto');
    });
  });
});

describe('CATEGORY_LABELS', () => {
  it('has labels for all categories', () => {
    expect(CATEGORY_LABELS.crypto).toBeTruthy();
    expect(CATEGORY_LABELS['thai-stock']).toBeTruthy();
    expect(CATEGORY_LABELS['us-stock']).toBeTruthy();
    expect(CATEGORY_LABELS.fund).toBeTruthy();
    expect(CATEGORY_LABELS.gold).toBeTruthy();
  });
});

describe('Asset-Broker integrity', () => {
  it('all broker slugs in assets reference valid brokers', () => {
    Object.entries(ASSETS).forEach(([key, cfg]) => {
      cfg.brokerSlugs.forEach(slug => {
        const broker = getBroker(slug);
        expect(broker).toBeDefined();
      });
    });
  });
});
