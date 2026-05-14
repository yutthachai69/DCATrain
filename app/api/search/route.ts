import { NextResponse } from 'next/server';
import { ASSETS } from '@/lib/assets';

export const dynamic = 'force-dynamic';

type SearchResult = {
  symbol: string;
  name: string;
  source: 'yahoo' | 'coingecko';
  type: string;
  coingeckoId?: string;
  curated: boolean;
};

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 20;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

const searchCache = new Map<string, { data: SearchResult[]; expiry: number }>();
const CACHE_TTL = 10 * 60 * 1000;

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'คำขอมากเกินไป กรุณารอสักครู่' }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get('q') || '').trim();
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const cached = searchCache.get(q.toLowerCase());
  if (cached && Date.now() < cached.expiry) {
    return NextResponse.json({ results: cached.data });
  }

  const results: SearchResult[] = [];
  const seen = new Set<string>();

  const ql = q.toLowerCase();
  for (const [key, cfg] of Object.entries(ASSETS)) {
    if (
      key.toLowerCase().includes(ql) ||
      cfg.name.toLowerCase().includes(ql) ||
      cfg.symbol.toLowerCase().includes(ql)
    ) {
      results.push({
        symbol: cfg.symbol,
        name: cfg.name,
        source: cfg.source,
        type: cfg.category,
        coingeckoId: cfg.coingeckoId,
        curated: true,
      });
      seen.add(cfg.symbol.toLowerCase());
    }
  }

  const [cryptoResults, yahooResults] = await Promise.allSettled([
    searchCoinGecko(q),
    searchYahoo(q),
  ]);

  if (cryptoResults.status === 'fulfilled') {
    for (const r of cryptoResults.value) {
      if (!seen.has(r.symbol.toLowerCase())) {
        results.push(r);
        seen.add(r.symbol.toLowerCase());
      }
    }
  }

  if (yahooResults.status === 'fulfilled') {
    for (const r of yahooResults.value) {
      if (!seen.has(r.symbol.toLowerCase())) {
        results.push(r);
        seen.add(r.symbol.toLowerCase());
      }
    }
  }

  const limited = results.slice(0, 20);
  searchCache.set(q.toLowerCase(), { data: limited, expiry: Date.now() + CACHE_TTL });

  return NextResponse.json({ results: limited });
}

async function searchCoinGecko(q: string): Promise<SearchResult[]> {
  try {
    const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    const coins: Array<{ id: string; symbol: string; name: string }> = data.coins || [];
    return coins.slice(0, 8).map((coin) => ({
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      source: 'coingecko' as const,
      type: 'crypto',
      coingeckoId: coin.id,
      curated: false,
    }));
  } catch {
    return [];
  }
}

async function searchYahoo(q: string): Promise<SearchResult[]> {
  try {
    const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=8&newsCount=0`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return [];
    const data = await res.json();
    const quotes: Array<{ symbol: string; shortname?: string; longname?: string; quoteType?: string }> = data.quotes || [];
    return quotes.slice(0, 8).map((quote) => ({
      symbol: quote.symbol,
      name: quote.shortname || quote.longname || quote.symbol,
      source: 'yahoo' as const,
      type: (quote.quoteType || 'equity').toLowerCase(),
      curated: false,
    }));
  } catch {
    return [];
  }
}
