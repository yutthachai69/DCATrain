import type { MetadataRoute } from 'next';
import { BROKERS } from '@/lib/brokers';
import { CATEGORIES } from '@/lib/catalog';
import { LESSONS } from '@/lib/lessons';

const BASE = 'https://dca-invest.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const brokerPages = BROKERS.map((b) => ({
    url: `${BASE}/how-to-buy/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const categoryPages = CATEGORIES.map((c) => ({
    url: `${BASE}/explore/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/planner`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/analyzer`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/explore`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/portfolios`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/compare`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/simulator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/backtest`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE}/alerts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE}/how-to-buy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/learn`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/quiz`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ...LESSONS.map((l) => ({
      url: `${BASE}/learn/${l.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...categoryPages,
    ...brokerPages,
  ];
}
