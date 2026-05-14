import { NextResponse } from 'next/server';
import { analyzeAsset, PricePoint } from '@/lib/analysis';
import { ASSETS } from '@/lib/assets';

export const dynamic = 'force-dynamic';

const CRYPTO_YAHOO_FALLBACK: Record<string, string> = {
  BTC: 'BTC-USD',
  ETH: 'ETH-USD',
  XRP: 'XRP-USD',
  SOL: 'SOL-USD',
  BNB: 'BNB-USD',
  DOGE: 'DOGE-USD',
  ADA: 'ADA-USD',
  MATIC: 'MATIC-USD',
};

type YahooQuote = {
  open?: Array<number | null>;
  high?: Array<number | null>;
  low?: Array<number | null>;
  close?: Array<number | null>;
  volume?: Array<number | null>;
};

const cache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // 30 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  rateLimitMap.set(ip, recent);
  if (recent.length >= RATE_LIMIT_MAX) return true;
  recent.push(now);
  return false;
}

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'คำขอมากเกินไป กรุณารอสักครู่' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const requestedAsset = searchParams.get('asset') || 'BTC';
    const customSymbol = searchParams.get('symbol');
    const customSource = searchParams.get('source') as 'yahoo' | 'coingecko' | null;
    const rawDays = Number(searchParams.get('days') || 365);
    const days = Number.isFinite(rawDays) ? Math.min(Math.max(rawDays, 120), 1095) : 365;

    const curatedAsset = ASSETS[requestedAsset];

    let assetKey: string;
    let symbol: string;
    let source: 'yahoo' | 'coingecko';
    let coingeckoId: string | undefined;
    let assetInfo: Record<string, unknown>;

    if (curatedAsset) {
      assetKey = requestedAsset;
      symbol = curatedAsset.symbol;
      source = curatedAsset.source;
      coingeckoId = curatedAsset.coingeckoId;
      assetInfo = { ...curatedAsset };
    } else if (customSymbol && customSource) {
      assetKey = customSymbol;
      symbol = customSymbol;
      source = customSource;
      coingeckoId = searchParams.get('coingeckoId') || undefined;
      assetInfo = { name: requestedAsset, symbol, source, category: 'custom' };
    } else {
      return NextResponse.json({ error: 'ไม่พบสินทรัพย์ที่เลือก' }, { status: 400 });
    }

    const cacheKey = `${assetKey}:${days}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return NextResponse.json(cached.data);
    }

    const prices = source === 'coingecko'
      ? await getCryptoHistory(assetKey, coingeckoId || symbol, days)
      : await getYahooHistory(symbol, days);
    if (prices.length < 120) {
      throw new Error(`ข้อมูลราคาของ ${assetKey} ไม่พอสำหรับวิเคราะห์`);
    }
    const analysis = analyzeAsset(prices);
    const responseData = { assetKey, asset: assetInfo, analysis };

    cache.set(cacheKey, { data: responseData, expiry: Date.now() + CACHE_TTL });

    return NextResponse.json(responseData);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function getYahooHistory(symbol: string, days: number): Promise<PricePoint[]> {
  const end = Math.floor(Date.now() / 1000);
  const start = end - days * 24 * 60 * 60;
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${start}&period2=${end}&interval=1d&events=history`;
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });

  if (!response.ok) {
    throw new Error(`ดึงข้อมูลจาก Yahoo Finance ไม่ได้ (${symbol})`);
  }

  const payload = await response.json();
  const result = payload?.chart?.result?.[0];
  const timestamps: number[] = result?.timestamp || [];
  const quotes: YahooQuote = result?.indicators?.quote?.[0] || {};

  return timestamps
    .map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().slice(0, 10),
      open: Number(quotes.open?.[index] ?? quotes.close?.[index]),
      high: Number(quotes.high?.[index] ?? quotes.close?.[index]),
      low: Number(quotes.low?.[index] ?? quotes.close?.[index]),
      close: Number(quotes.close?.[index]),
      volume: Number(quotes.volume?.[index] ?? 0),
    }))
    .filter((point) => Number.isFinite(point.close));
}

async function getCryptoHistory(assetKey: string, coinId: string, days: number): Promise<PricePoint[]> {
  try {
    return await getCoinGeckoHistory(coinId, days);
  } catch (error) {
    const fallbackSymbol = CRYPTO_YAHOO_FALLBACK[assetKey];
    if (!fallbackSymbol) throw error;
    return getYahooHistory(fallbackSymbol, days);
  }
}

async function getCoinGeckoHistory(coinId: string, days: number): Promise<PricePoint[]> {
  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}&interval=daily`;
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(15000) });

  if (!response.ok) {
    throw new Error(`ดึงข้อมูลจาก CoinGecko ไม่ได้ (${coinId})`);
  }

  const payload = await response.json();
  const prices: Array<[number, number]> = payload.prices || [];
  const volumes: Array<[number, number]> = payload.total_volumes || [];

  return prices
    .map(([timestamp, close], index) => ({
      date: new Date(timestamp).toISOString().slice(0, 10),
      open: close,
      high: close,
      low: close,
      close,
      volume: volumes[index]?.[1] || 0,
    }))
    .filter((point) => Number.isFinite(point.close));
}
