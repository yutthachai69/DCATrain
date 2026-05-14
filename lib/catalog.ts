import type { AssetCategory } from './brokers';

export type CategoryInfo = {
  slug: AssetCategory;
  name: string;
  shortName: string;
  description: string;
  whyInvest: string;
  riskLevel: string;
  suitableFor: string;
  beginnerPick: string;
  icon: string;
};

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'crypto',
    name: 'คริปโตเคอร์เรนซี',
    shortName: 'คริปโต',
    description: 'สกุลเงินดิจิทัลที่ทำงานบน Blockchain ไม่มีธนาคารกลางควบคุม ราคาขึ้นลงตาม demand/supply ของตลาดโลก',
    whyInvest: 'ผลตอบแทนสูงมากในระยะยาว (BTC ขึ้น 1,000%+ ใน 5 ปี) แต่ต้องทนความผันผวนรุนแรง ไม่เหมาะกับเงินที่ต้องใช้เร็วๆ',
    riskLevel: 'สูงมาก',
    suitableFor: 'คนรับเสี่ยงสูง ลงทุนระยะยาว 5+ ปี ไม่เกิน 10-20% ของพอร์ต',
    beginnerPick: 'BTC',
    icon: '₿',
  },
  {
    slug: 'thai-stock',
    name: 'หุ้นไทย',
    shortName: 'หุ้นไทย',
    description: 'หุ้นของบริษัทที่จดทะเบียนในตลาดหลักทรัพย์แห่งประเทศไทย (SET) ซื้อขายผ่าน broker ไทย',
    whyInvest: 'ได้ปันผลรายปี ลงทุนเป็นเงินบาทง่าย ไม่ต้องแลกเงิน เหมาะกับคนอยากลงทุนในธุรกิจที่คุ้นเคย',
    riskLevel: 'ปานกลาง',
    suitableFor: 'คนที่มีเงินลงทุน 10,000+ บาท ลงทุนระยะกลาง-ยาว 3+ ปี',
    beginnerPick: 'PTT.BK',
    icon: '🇹🇭',
  },
  {
    slug: 'us-stock',
    name: 'หุ้นต่างประเทศ (US)',
    shortName: 'หุ้น US',
    description: 'หุ้นของบริษัทเทคโนโลยีระดับโลก เช่น Apple, Google, Microsoft ลงทุนผ่านกองทุนไทยที่ซื้อหุ้น US ให้',
    whyInvest: 'บริษัทเทคใหญ่เติบโตเร็วกว่าหุ้นไทย ช่วยกระจายความเสี่ยงไปนอกประเทศ',
    riskLevel: 'ปานกลาง',
    suitableFor: 'คนที่อยากลงทุนในบริษัทระดับโลก ผ่านกองทุนไทย ลงทุนระยะยาว 5+ ปี',
    beginnerPick: 'AAPL',
    icon: '🇺🇸',
  },
  {
    slug: 'etf',
    name: 'ETF และดัชนี',
    shortName: 'ETF/ดัชนี',
    description: 'กองทุนที่ซื้อหุ้นหลายร้อยตัวในคราวเดียว เช่น S&P500 ซื้อ 500 บริษัทใหญ่สุดใน US ช่วยกระจายความเสี่ยง',
    whyInvest: 'กระจายความเสี่ยงได้ดีที่สุด ไม่ต้องเลือกหุ้นเอง "ซื้อตลาดทั้งตลาด" วอร์เรน บัฟเฟตต์แนะนำวิธีนี้',
    riskLevel: 'ปานกลาง',
    suitableFor: 'มือใหม่ทุกคน! เหมาะที่สุดสำหรับ DCA ระยะยาว',
    beginnerPick: 'S&P500',
    icon: '📊',
  },
  {
    slug: 'gold',
    name: 'ทองคำ',
    shortName: 'ทองคำ',
    description: 'สินทรัพย์ปลอดภัยที่คนทั่วโลกเชื่อถือมากว่า 5,000 ปี ราคามักขึ้นเวลาเศรษฐกิจไม่ดี',
    whyInvest: 'ป้องกันเงินเฟ้อ กระจายความเสี่ยงจากหุ้น ราคาค่อนข้างมั่นคงในระยะยาว',
    riskLevel: 'ต่ำ-ปานกลาง',
    suitableFor: 'ทุกคน ควรมี 10-20% ของพอร์ตเพื่อกระจายความเสี่ยง',
    beginnerPick: 'ทอง',
    icon: '🥇',
  },
  {
    slug: 'commodity',
    name: 'สินค้าโภคภัณฑ์',
    shortName: 'โภคภัณฑ์',
    description: 'สินค้าจริงเช่น น้ำมัน เงิน ทองแดง ราคาขึ้นลงตามเศรษฐกิจโลกและสถานการณ์ภูมิรัฐศาสตร์',
    whyInvest: 'ช่วยป้องกันเงินเฟ้อ แต่ผันผวนสูงและคาดเดายาก ไม่แนะนำเป็นสินทรัพย์หลัก',
    riskLevel: 'สูง',
    suitableFor: 'นักลงทุนที่มีประสบการณ์แล้ว ลงทุนไม่เกิน 5-10% ของพอร์ต',
    beginnerPick: 'เงิน',
    icon: '🛢️',
  },
  {
    slug: 'fund',
    name: 'กองทุนรวม',
    shortName: 'กองทุน',
    description: 'กองทุนที่รวบรวมเงินจากนักลงทุนหลายคน แล้วมีผู้จัดการกองทุนไปลงทุนให้ ซื้อผ่านแอปธนาคารได้เลย',
    whyInvest: 'ง่ายที่สุดสำหรับมือใหม่ ไม่ต้องเลือกหุ้นเอง มีคนดูแลให้ DCA อัตโนมัติผ่านแอปธนาคาร',
    riskLevel: 'ต่ำ-ปานกลาง (แล้วแต่กองทุน)',
    suitableFor: 'มือใหม่ที่อยากเริ่มง่ายๆ ผ่านแอปธนาคาร',
    beginnerPick: 'K-US500X',
    icon: '🏦',
  },
];

export function getCategory(slug: string): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
