import { type AssetCategory, type Broker, getBroker } from './brokers';

export type AssetSource = 'yahoo' | 'coingecko';

export type AssetTag =
  | 'beginner'
  | 'dividend'
  | 'volatile'
  | 'safe-haven'
  | 'long-term'
  | 'meme'
  | 'advanced';

export const TAG_CONFIG: Record<AssetTag, { label: string; color: string }> = {
  beginner: { label: 'แนะนำมือใหม่', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' },
  dividend: { label: 'ปันผลดี', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  volatile: { label: 'ผันผวนสูง', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
  'safe-haven': { label: 'สินทรัพย์ปลอดภัย', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' },
  'long-term': { label: 'เหมาะลงทุนยาว', color: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300' },
  meme: { label: 'Meme / เก็งกำไร', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300' },
  advanced: { label: 'ผู้มีประสบการณ์', color: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
};

export type AssetConfig = {
  name: string;
  symbol: string;
  source: AssetSource;
  coingeckoId?: string;
  category: AssetCategory;
  description: string;
  riskLabel: string;
  tags: AssetTag[];
  brokerSlugs: string[];
  minBuy: string;
  avgReturn: string;
};

export const ASSETS: Record<string, AssetConfig> = {
  // ─── Crypto (8) ───
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    source: 'coingecko',
    coingeckoId: 'bitcoin',
    category: 'crypto',
    description: 'สกุลเงินดิจิทัลอันดับ 1 ของโลก ราคาผันผวนสูงมาก แต่เติบโตแรงในระยะยาว เหมาะกับคนรับเสี่ยงสูง',
    riskLabel: 'สูงมาก',
    tags: ['beginner', 'volatile', 'long-term'],
    brokerSlugs: ['bitkub', 'binance', 'coinbase'],
    minBuy: 'เริ่มต้น 1 บาท',
    avgReturn: '~50-100%/ปี (แต่มีปีที่ -50% ด้วย)',
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    source: 'coingecko',
    coingeckoId: 'ethereum',
    category: 'crypto',
    description: 'Blockchain อันดับ 2 ที่ใช้รัน smart contract ผันผวนสูงแต่มีการใช้งานจริงมาก',
    riskLabel: 'สูงมาก',
    tags: ['beginner', 'volatile', 'long-term'],
    brokerSlugs: ['bitkub', 'binance', 'coinbase'],
    minBuy: 'เริ่มต้น 1 บาท',
    avgReturn: '~30-80%/ปี (แต่มีปีที่ -60% ด้วย)',
  },
  XRP: {
    name: 'XRP (Ripple)',
    symbol: 'XRP',
    source: 'coingecko',
    coingeckoId: 'ripple',
    category: 'crypto',
    description: 'เหรียญสำหรับโอนเงินข้ามประเทศ ราคาถูก โอนเร็ว เป็นที่นิยมในไทยมาก',
    riskLabel: 'สูงมาก',
    tags: ['volatile'],
    brokerSlugs: ['bitkub', 'binance'],
    minBuy: 'เริ่มต้น 1 บาท',
    avgReturn: '~20-60%/ปี (ผันผวนสูง)',
  },
  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    source: 'coingecko',
    coingeckoId: 'solana',
    category: 'crypto',
    description: 'Blockchain เร็วสุดๆ ค่าธรรมเนียมถูก เป็นคู่แข่ง Ethereum ที่กำลังเติบโต',
    riskLabel: 'สูงมาก',
    tags: ['volatile', 'long-term'],
    brokerSlugs: ['bitkub', 'binance', 'coinbase'],
    minBuy: 'เริ่มต้น 1 บาท',
    avgReturn: '~30-100%/ปี (ผันผวนสูงมาก)',
  },
  BNB: {
    name: 'BNB (Binance Coin)',
    symbol: 'BNB',
    source: 'coingecko',
    coingeckoId: 'binancecoin',
    category: 'crypto',
    description: 'เหรียญของ Binance exchange ที่ใหญ่ที่สุดในโลก ใช้จ่ายค่าธรรมเนียมในระบบ Binance',
    riskLabel: 'สูง',
    tags: ['volatile'],
    brokerSlugs: ['binance', 'bitkub'],
    minBuy: 'เริ่มต้น 1 บาท',
    avgReturn: '~20-50%/ปี',
  },
  DOGE: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    source: 'coingecko',
    coingeckoId: 'dogecoin',
    category: 'crypto',
    description: 'เหรียญ meme ที่เริ่มจากล้อเล่น แต่ตอนนี้มีมูลค่าตลาดสูงมาก ผันผวนตามกระแส',
    riskLabel: 'สูงมาก',
    tags: ['meme', 'volatile'],
    brokerSlugs: ['bitkub', 'binance', 'coinbase'],
    minBuy: 'เริ่มต้น 1 บาท',
    avgReturn: 'ไม่แน่นอน (ขึ้นลงตามกระแสข่าว)',
  },
  ADA: {
    name: 'Cardano',
    symbol: 'ADA',
    source: 'coingecko',
    coingeckoId: 'cardano',
    category: 'crypto',
    description: 'Blockchain ที่เน้นการวิจัยและพัฒนาอย่างเป็นระบบ ถูกออกแบบมาให้ปลอดภัยและยั่งยืน',
    riskLabel: 'สูงมาก',
    tags: ['advanced', 'volatile'],
    brokerSlugs: ['bitkub', 'binance'],
    minBuy: 'เริ่มต้น 1 บาท',
    avgReturn: '~20-50%/ปี (ผันผวนสูง)',
  },
  MATIC: {
    name: 'Polygon (MATIC)',
    symbol: 'MATIC',
    source: 'coingecko',
    coingeckoId: 'matic-network',
    category: 'crypto',
    description: 'เครือข่ายที่ช่วยให้ Ethereum เร็วขึ้นและถูกลง เป็นที่นิยมในวงการ DeFi และ NFT',
    riskLabel: 'สูงมาก',
    tags: ['advanced', 'volatile'],
    brokerSlugs: ['bitkub', 'binance', 'coinbase'],
    minBuy: 'เริ่มต้น 1 บาท',
    avgReturn: '~20-80%/ปี (ผันผวนสูงมาก)',
  },

  // ─── หุ้นไทย (5) ───
  'PTT.BK': {
    name: 'PTT',
    symbol: 'PTT.BK',
    source: 'yahoo',
    category: 'thai-stock',
    description: 'หุ้นปตท. บริษัทพลังงานที่ใหญ่ที่สุดในไทย จ่ายปันผลสม่ำเสมอ',
    riskLabel: 'ปานกลาง',
    tags: ['beginner', 'dividend', 'long-term'],
    brokerSlugs: ['settrade', 'scb-easy'],
    minBuy: 'ขั้นต่ำ 100 หุ้น × ราคาต่อหุ้น',
    avgReturn: '~5-10%/ปี (รวมปันผล)',
  },
  'SCB.BK': {
    name: 'SCB (ธนาคารไทยพาณิชย์)',
    symbol: 'SCB.BK',
    source: 'yahoo',
    category: 'thai-stock',
    description: 'หุ้นธนาคารไทยพาณิชย์ ธนาคารขนาดใหญ่ที่กำลังปรับตัวสู่ดิจิทัล จ่ายปันผลดี',
    riskLabel: 'ปานกลาง',
    tags: ['beginner', 'dividend'],
    brokerSlugs: ['settrade', 'scb-easy'],
    minBuy: 'ขั้นต่ำ 100 หุ้น × ราคาต่อหุ้น',
    avgReturn: '~5-12%/ปี (รวมปันผล)',
  },
  'GULF.BK': {
    name: 'Gulf Energy',
    symbol: 'GULF.BK',
    source: 'yahoo',
    category: 'thai-stock',
    description: 'หุ้นพลังงานที่เติบโตเร็วที่สุดในไทย มีโรงไฟฟ้าทั้งในและต่างประเทศ',
    riskLabel: 'ปานกลาง-สูง',
    tags: ['long-term'],
    brokerSlugs: ['settrade', 'scb-easy'],
    minBuy: 'ขั้นต่ำ 100 หุ้น × ราคาต่อหุ้น',
    avgReturn: '~10-20%/ปี',
  },
  'CPALL.BK': {
    name: 'CP ALL (7-Eleven)',
    symbol: 'CPALL.BK',
    source: 'yahoo',
    category: 'thai-stock',
    description: 'เจ้าของ 7-Eleven ในไทย มีสาขากว่า 14,000 แห่ง รายได้มั่นคงจากธุรกิจค้าปลีก',
    riskLabel: 'ปานกลาง',
    tags: ['beginner', 'dividend', 'long-term'],
    brokerSlugs: ['settrade', 'scb-easy'],
    minBuy: 'ขั้นต่ำ 100 หุ้น × ราคาต่อหุ้น',
    avgReturn: '~8-15%/ปี',
  },
  'AOT.BK': {
    name: 'AOT (ท่าอากาศยาน)',
    symbol: 'AOT.BK',
    source: 'yahoo',
    category: 'thai-stock',
    description: 'เจ้าของสนามบินสุวรรณภูมิและอีก 5 แห่ง รายได้ฟื้นตัวหลังนักท่องเที่ยวกลับมา',
    riskLabel: 'ปานกลาง',
    tags: ['beginner', 'long-term'],
    brokerSlugs: ['settrade', 'scb-easy'],
    minBuy: 'ขั้นต่ำ 100 หุ้น × ราคาต่อหุ้น',
    avgReturn: '~10-18%/ปี',
  },

  // ─── หุ้น US (4) ───
  AAPL: {
    name: 'Apple',
    symbol: 'AAPL',
    source: 'yahoo',
    category: 'us-stock',
    description: 'หุ้นบริษัท Apple บริษัทเทคโนโลยีที่ใหญ่ที่สุดในโลก มั่นคงแต่ยังเติบโตได้',
    riskLabel: 'ปานกลาง',
    tags: ['beginner', 'long-term'],
    brokerSlugs: ['jitta-wealth', 'finnomena'],
    minBuy: 'ผ่านกองทุน เริ่มต้น 1,000 บาท',
    avgReturn: '~15-25%/ปี',
  },
  MSFT: {
    name: 'Microsoft',
    symbol: 'MSFT',
    source: 'yahoo',
    category: 'us-stock',
    description: 'เจ้าของ Windows, Azure Cloud, Office365 และ AI Copilot รายได้มั่นคงเติบโตต่อเนื่อง',
    riskLabel: 'ปานกลาง',
    tags: ['beginner', 'long-term'],
    brokerSlugs: ['jitta-wealth', 'finnomena'],
    minBuy: 'ผ่านกองทุน เริ่มต้น 1,000 บาท',
    avgReturn: '~15-25%/ปี',
  },
  GOOGL: {
    name: 'Alphabet (Google)',
    symbol: 'GOOGL',
    source: 'yahoo',
    category: 'us-stock',
    description: 'เจ้าของ Google, YouTube, Android รายได้หลักจากโฆษณาออนไลน์และ Cloud',
    riskLabel: 'ปานกลาง',
    tags: ['beginner', 'long-term'],
    brokerSlugs: ['jitta-wealth', 'finnomena'],
    minBuy: 'ผ่านกองทุน เริ่มต้น 1,000 บาท',
    avgReturn: '~15-25%/ปี',
  },
  TSLA: {
    name: 'Tesla',
    symbol: 'TSLA',
    source: 'yahoo',
    category: 'us-stock',
    description: 'ผู้นำรถยนต์ไฟฟ้า + พลังงานแสงอาทิตย์ + AI/Robotics ราคาผันผวนสูงกว่าหุ้นเทคทั่วไป',
    riskLabel: 'สูง',
    tags: ['volatile', 'advanced'],
    brokerSlugs: ['jitta-wealth', 'finnomena'],
    minBuy: 'ผ่านกองทุน เริ่มต้น 1,000 บาท',
    avgReturn: '~20-50%/ปี (ผันผวนสูง)',
  },

  // ─── ETF / ดัชนี (3) ───
  'S&P500': {
    name: 'S&P 500',
    symbol: '^GSPC',
    source: 'yahoo',
    category: 'etf',
    description: 'ดัชนีหุ้น 500 บริษัทใหญ่ที่สุดในสหรัฐ กระจายความเสี่ยงได้ดี เหมาะกับมือใหม่',
    riskLabel: 'ปานกลาง',
    tags: ['beginner', 'long-term', 'safe-haven'],
    brokerSlugs: ['jitta-wealth', 'finnomena', 'kbank-invest'],
    minBuy: 'ผ่านกองทุน เริ่มต้น 500-1,000 บาท',
    avgReturn: '~8-12%/ปี (เฉลี่ย 10 ปี)',
  },
  NASDAQ: {
    name: 'NASDAQ Composite',
    symbol: '^IXIC',
    source: 'yahoo',
    category: 'etf',
    description: 'ดัชนีหุ้นเทคโนโลยี US รวม Apple, Google, Microsoft, Tesla ผลตอบแทนสูงแต่ผันผวนกว่า S&P',
    riskLabel: 'ปานกลาง-สูง',
    tags: ['long-term'],
    brokerSlugs: ['jitta-wealth', 'finnomena'],
    minBuy: 'ผ่านกองทุน เริ่มต้น 1,000 บาท',
    avgReturn: '~10-15%/ปี',
  },
  SET: {
    name: 'SET Index (ตลาดหุ้นไทย)',
    symbol: '^SET.BK',
    source: 'yahoo',
    category: 'etf',
    description: 'ดัชนีรวมหุ้นทั้งตลาดหลักทรัพย์ไทย ลงทุนผ่านกองทุน SET50 หรือ ThaiDEX ได้',
    riskLabel: 'ปานกลาง',
    tags: ['beginner', 'long-term'],
    brokerSlugs: ['settrade', 'scb-easy', 'kbank-invest'],
    minBuy: 'ผ่านกองทุน เริ่มต้น 500 บาท',
    avgReturn: '~5-10%/ปี',
  },

  // ─── ทองคำ + โภคภัณฑ์ (3) ───
  'ทอง': {
    name: 'ทองคำ (Gold)',
    symbol: 'GC=F',
    source: 'yahoo',
    category: 'gold',
    description: 'ทองคำ สินทรัพย์ปลอดภัยที่มักขึ้นเวลาเศรษฐกิจไม่ดี ช่วยกระจายความเสี่ยง',
    riskLabel: 'ต่ำ-ปานกลาง',
    tags: ['beginner', 'safe-haven'],
    brokerSlugs: ['mts-gold', 'kbank-invest'],
    minBuy: 'ทองแท่ง 1 สลึง (~9,000 บาท) หรือกองทุน 1,000 บาท',
    avgReturn: '~8-12%/ปี',
  },
  'เงิน': {
    name: 'เงิน (Silver)',
    symbol: 'SI=F',
    source: 'yahoo',
    category: 'commodity',
    description: 'โลหะเงิน ใช้ทั้งในอุตสาหกรรมและเป็นสินทรัพย์ปลอดภัย ผันผวนมากกว่าทอง',
    riskLabel: 'ปานกลาง',
    tags: ['advanced', 'volatile'],
    brokerSlugs: ['mts-gold'],
    minBuy: 'ผ่านกองทุนหรือ CFD เริ่มต้น 1,000 บาท',
    avgReturn: '~5-15%/ปี',
  },
  'น้ำมัน': {
    name: 'น้ำมันดิบ (Crude Oil)',
    symbol: 'CL=F',
    source: 'yahoo',
    category: 'commodity',
    description: 'น้ำมันดิบ WTI ราคาขึ้นลงตามเศรษฐกิจโลกและภูมิรัฐศาสตร์ ไม่แนะนำสำหรับมือใหม่',
    riskLabel: 'สูง',
    tags: ['advanced', 'volatile'],
    brokerSlugs: [],
    minBuy: 'ผ่าน CFD หรือ ETF ต่างประเทศ',
    avgReturn: 'ผันผวนตามสถานการณ์โลก',
  },

  // ─── กองทุนยอดนิยม (2) ───
  TMBGOLDS: {
    name: 'กองทุนทองคำ TMBGOLDS',
    symbol: 'TMBGOLDS.BK',
    source: 'yahoo',
    category: 'fund',
    description: 'กองทุนรวมที่ลงทุนในทองคำ ซื้อง่ายผ่านแอปธนาคาร ไม่ต้องเก็บทองจริง',
    riskLabel: 'ต่ำ-ปานกลาง',
    tags: ['beginner', 'safe-haven'],
    brokerSlugs: ['finnomena', 'kbank-invest', 'scb-easy'],
    minBuy: 'เริ่มต้น 1,000 บาท',
    avgReturn: '~8-12%/ปี (ตามราคาทองคำ)',
  },
  'K-US500X': {
    name: 'กองทุน K-US500X (S&P500)',
    symbol: 'K-US500X.BK',
    source: 'yahoo',
    category: 'fund',
    description: 'กองทุนของ KASSET ที่ลงทุนตามดัชนี S&P500 ผ่าน K PLUS ได้เลย DCA ง่ายมาก',
    riskLabel: 'ปานกลาง',
    tags: ['beginner', 'long-term'],
    brokerSlugs: ['kbank-invest', 'finnomena'],
    minBuy: 'เริ่มต้น 500 บาท',
    avgReturn: '~8-12%/ปี (ตามดัชนี S&P500)',
  },
};

export function getBrokersForAsset(assetKey: string): Broker[] {
  const asset = ASSETS[assetKey];
  if (!asset) return [];
  return asset.brokerSlugs.map(getBroker).filter((b): b is Broker => b !== undefined);
}

export function getAssetsByCategory(category: AssetCategory): Array<[string, AssetConfig]> {
  return Object.entries(ASSETS).filter(([, cfg]) => cfg.category === category);
}

export const GLOSSARY = {
  RSI: 'ตัววัดว่าราคาขึ้นหรือลงแรงเกินไปหรือไม่ ค่าสูงกว่า 70 มักแปลว่าเริ่มร้อนแรง ต่ำกว่า 30 แปลว่าลงแรง',
  MACD: 'ตัวดูแรงส่งของราคา ถ้าเส้น MACD อยู่เหนือเส้นสัญญาณ มักแปลว่าโมเมนตัมดีขึ้น',
  DCA: 'การทยอยซื้อเป็นรอบ ๆ เช่น ทุกสัปดาห์หรือทุกเดือน เพื่อลดความเสี่ยงจากการซื้อผิดจังหวะ',
  'ค่าเฉลี่ย 30/90 วัน': 'เส้นราคาเฉลี่ยย้อนหลัง ใช้ดูว่าราคาปัจจุบันอยู่ในแนวโน้มขึ้น ลง หรือแกว่งตัว',
  ความผันผวน: 'ระดับการแกว่งของราคา ยิ่งสูงยิ่งมีโอกาสกำไรและขาดทุนเร็ว',
};
