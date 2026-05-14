export type PortfolioRisk = 'low' | 'medium' | 'high';

export type PortfolioItem = {
  assetKey: string;
  label: string;
  percent: number;
  color: string;
};

export type Portfolio = {
  slug: string;
  name: string;
  subtitle: string;
  riskLevel: PortfolioRisk;
  expectedReturn: string;
  items: PortfolioItem[];
  description: string;
  suitableFor: string;
  monthlyMin: number;
};

export const PORTFOLIOS: Portfolio[] = [
  {
    slug: 'conservative',
    name: 'พอร์ตเสี่ยงต่ำ',
    subtitle: 'เน้นมั่นคง ผลตอบแทนสม่ำเสมอ',
    riskLevel: 'low',
    expectedReturn: '5-8%/ปี',
    items: [
      { assetKey: 'ทอง', label: 'ทองคำ', percent: 40, color: '#f59e0b' },
      { assetKey: 'S&P500', label: 'กองทุน S&P500', percent: 40, color: '#3b82f6' },
      { assetKey: 'TMBGOLDS', label: 'กองทุนทองคำ', percent: 20, color: '#eab308' },
    ],
    description: 'พอร์ตนี้เน้นสินทรัพย์ที่มั่นคง ทองคำช่วยป้องกันเงินเฟ้อ S&P500 ให้ผลตอบแทนระยะยาว กองทุนทองเป็นทางเลือกที่ซื้อง่าย เหมาะกับคนที่ไม่อยากเสี่ยงมาก',
    suitableFor: 'คนที่เพิ่งเริ่มลงทุน, คนใกล้เกษียณ, คนที่ไม่อยากเห็นพอร์ตติดลบเยอะ',
    monthlyMin: 3000,
  },
  {
    slug: 'growth',
    name: 'พอร์ตเติบโต',
    subtitle: 'สมดุลระหว่างเติบโตกับความเสี่ยง',
    riskLevel: 'medium',
    expectedReturn: '10-15%/ปี',
    items: [
      { assetKey: 'S&P500', label: 'S&P500', percent: 35, color: '#3b82f6' },
      { assetKey: 'AAPL', label: 'หุ้น US (Apple)', percent: 20, color: '#8b5cf6' },
      { assetKey: 'BTC', label: 'Bitcoin', percent: 15, color: '#f97316' },
      { assetKey: 'ทอง', label: 'ทองคำ', percent: 15, color: '#f59e0b' },
      { assetKey: 'PTT.BK', label: 'หุ้นไทย (PTT)', percent: 15, color: '#10b981' },
    ],
    description: 'พอร์ตนี้ผสมสินทรัพย์หลายประเภทเพื่อกระจายความเสี่ยง S&P500 เป็นแกนหลัก เติม Crypto และหุ้นเพื่อเพิ่มการเติบโต ทองคำช่วยลดความผันผวน',
    suitableFor: 'คนอายุ 25-45 ปี ที่รับเสี่ยงได้ปานกลาง ลงทุนระยะยาว 5-10 ปี',
    monthlyMin: 5000,
  },
  {
    slug: 'aggressive',
    name: 'พอร์ตเติบโตสูง',
    subtitle: 'ผลตอบแทนสูง ผันผวนสูง',
    riskLevel: 'high',
    expectedReturn: '15-30%/ปี (แต่ปีที่แย่อาจ -30%)',
    items: [
      { assetKey: 'BTC', label: 'Bitcoin', percent: 25, color: '#f97316' },
      { assetKey: 'ETH', label: 'Ethereum', percent: 15, color: '#6366f1' },
      { assetKey: 'MSFT', label: 'หุ้น US (Microsoft)', percent: 20, color: '#8b5cf6' },
      { assetKey: 'TSLA', label: 'Tesla', percent: 10, color: '#ef4444' },
      { assetKey: 'S&P500', label: 'S&P500', percent: 20, color: '#3b82f6' },
      { assetKey: 'ทอง', label: 'ทองคำ', percent: 10, color: '#f59e0b' },
    ],
    description: 'พอร์ตนี้เน้น Crypto + หุ้นเทค ผลตอบแทนสูงแต่ต้องทนความผันผวน ปีที่ดีอาจ +50% แต่ปีที่แย่อาจ -30% เหมาะกับคนที่มีเวลาและอดทนรอ',
    suitableFor: 'คนอายุ 20-35 ปี ที่รับเสี่ยงสูงได้ ลงทุนระยะยาว 7+ ปี ไม่ต้องใช้เงินก้อนนี้เร็ว',
    monthlyMin: 5000,
  },
];

export function getPortfolio(slug: string): Portfolio | undefined {
  return PORTFOLIOS.find((p) => p.slug === slug);
}

export const RISK_COLORS: Record<PortfolioRisk, string> = {
  low: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-800',
  medium: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800',
  high: 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800',
};

export const RISK_LABELS: Record<PortfolioRisk, string> = {
  low: 'เสี่ยงต่ำ',
  medium: 'เสี่ยงปานกลาง',
  high: 'เสี่ยงสูง',
};
