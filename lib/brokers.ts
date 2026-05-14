export type AssetCategory = 'crypto' | 'thai-stock' | 'us-stock' | 'etf' | 'fund' | 'gold' | 'commodity';

export type Broker = {
  slug: string;
  name: string;
  url: string;
  signupUrl: string;
  affiliateTag?: string;
  categories: AssetCategory[];
  minDeposit: string;
  fees: string;
  dcaSupport: boolean;
  steps: string[];
  pros: string[];
  cons: string[];
};

export const BROKERS: Broker[] = [
  {
    slug: 'bitkub',
    name: 'Bitkub',
    url: 'https://www.bitkub.com',
    signupUrl: 'https://www.bitkub.com/signup',
    affiliateTag: '',
    categories: ['crypto'],
    minDeposit: 'ไม่มีขั้นต่ำ',
    fees: '0.25% ต่อออเดอร์',
    dcaSupport: true,
    steps: [
      'เข้าเว็บ bitkub.com หรือดาวน์โหลดแอป Bitkub',
      'กดสมัครสมาชิก กรอกอีเมลและตั้งรหัสผ่าน',
      'ยืนยันตัวตน (KYC) ด้วยบัตรประชาชน + ถ่ายเซลฟี',
      'ฝากเงินผ่านโอนธนาคาร (ได้ภายใน 1-15 นาที)',
      'เลือกเหรียญที่ต้องการ กดซื้อได้เลย หรือตั้ง DCA อัตโนมัติ',
    ],
    pros: ['แพลตฟอร์มไทย ใช้ภาษาไทยได้', 'ฝาก-ถอนเงินบาทง่าย', 'มี DCA อัตโนมัติในแอป', 'เหรียญยอดนิยมครบ'],
    cons: ['ค่าธรรมเนียมสูงกว่า exchange ต่างประเทศ', 'เหรียญมีให้เลือกน้อยกว่า Binance'],
  },
  {
    slug: 'binance',
    name: 'Binance',
    url: 'https://www.binance.com',
    signupUrl: 'https://www.binance.com/register',
    affiliateTag: '',
    categories: ['crypto'],
    minDeposit: 'ไม่มีขั้นต่ำ',
    fees: '0.1% ต่อออเดอร์ (ลดได้ถ้าใช้ BNB)',
    dcaSupport: true,
    steps: [
      'เข้า binance.com กด "Register"',
      'กรอกอีเมล ตั้งรหัสผ่าน',
      'ยืนยันตัวตน (KYC) ด้วยพาสปอร์ตหรือบัตรประชาชน',
      'ฝากเงินผ่าน P2P (เลือกจ่ายด้วยโอนธนาคารไทย)',
      'ไปที่ Auto-Invest เพื่อตั้ง DCA อัตโนมัติได้',
    ],
    pros: ['ค่าธรรมเนียมต่ำที่สุด', 'เหรียญให้เลือกมากกว่า 350+', 'มี Auto-Invest (DCA) ในตัว', 'สภาพคล่องสูง'],
    cons: ['เป็นแพลตฟอร์มต่างประเทศ', 'ฝาก-ถอนเงินบาทต้องผ่าน P2P', 'อินเทอร์เฟซซับซ้อนสำหรับมือใหม่'],
  },
  {
    slug: 'coinbase',
    name: 'Coinbase',
    url: 'https://www.coinbase.com',
    signupUrl: 'https://www.coinbase.com/signup',
    affiliateTag: '',
    categories: ['crypto'],
    minDeposit: 'ไม่มีขั้นต่ำ',
    fees: '~0.5-1.5% (ขึ้นกับวิธีจ่าย)',
    dcaSupport: true,
    steps: [
      'เข้า coinbase.com กด "Get started"',
      'กรอกข้อมูล ยืนยันอีเมลและเบอร์โทร',
      'ยืนยันตัวตนด้วยพาสปอร์ต',
      'เชื่อมบัตรเครดิต/เดบิตหรือโอนธนาคาร',
      'ตั้ง Recurring Buy เพื่อ DCA อัตโนมัติ',
    ],
    pros: ['อินเทอร์เฟซใช้ง่ายที่สุดสำหรับมือใหม่', 'บริษัทจดทะเบียนในตลาดหุ้น NASDAQ', 'มี Recurring Buy (DCA)'],
    cons: ['ค่าธรรมเนียมสูง', 'ไม่รองรับเงินบาทโดยตรง', 'ต้องใช้บัตร Visa/Master สกุลต่างประเทศ'],
  },
  {
    slug: 'settrade',
    name: 'Settrade (Streaming)',
    url: 'https://www.settrade.com',
    signupUrl: 'https://www.settrade.com',
    categories: ['thai-stock'],
    minDeposit: 'เปิดบัญชีขั้นต่ำ 5,000 บาท (แล้วแต่ broker)',
    fees: '0.15-0.25% ต่อออเดอร์',
    dcaSupport: false,
    steps: [
      'เลือก broker หุ้นไทยที่ต้องการ (เช่น Bualuang, KGI, Phatra)',
      'สมัครเปิดบัญชีผ่านเว็บหรือแอปของ broker นั้น',
      'ยืนยันตัวตน (e-KYC) ด้วยบัตรประชาชน',
      'โอนเงินเข้าบัญชีซื้อขาย',
      'เข้า Settrade Streaming เพื่อซื้อหุ้นไทย',
    ],
    pros: ['แพลตฟอร์มมาตรฐานตลาดหลักทรัพย์ไทย', 'ข้อมูลครบถ้วน', 'broker ไทยให้เลือกหลายราย'],
    cons: ['ต้องเปิดบัญชีกับ broker ก่อนถึงจะใช้ได้', 'ไม่มี DCA อัตโนมัติ ต้องซื้อเอง', 'ขั้นต่ำ 100 หุ้น (board lot)'],
  },
  {
    slug: 'scb-easy',
    name: 'SCB Easy / SCBS',
    url: 'https://www.scbs.com',
    signupUrl: 'https://www.scbs.com/open-account',
    categories: ['thai-stock', 'fund'],
    minDeposit: 'เปิดบัญชีขั้นต่ำ 5,000 บาท',
    fees: '0.15% ต่อออเดอร์ (หุ้น) / ไม่มีค่าธรรมเนียมซื้อกองทุน',
    dcaSupport: true,
    steps: [
      'ดาวน์โหลดแอป SCB Easy หรือเข้าเว็บ scbs.com',
      'กด "เปิดบัญชี" เลือกประเภทบัญชีหุ้นหรือกองทุน',
      'ยืนยันตัวตนด้วยบัตรประชาชน (ทำผ่านแอปได้เลย)',
      'โอนเงินเข้าบัญชี SCB ที่ผูกไว้',
      'ซื้อหุ้น/กองทุนได้ทันที ตั้ง DCA กองทุนรายเดือนได้',
    ],
    pros: ['เชื่อมกับ SCB Easy ที่หลายคนมีอยู่แล้ว', 'ซื้อกองทุนได้ง่าย DCA อัตโนมัติ', 'ค่าธรรมเนียมหุ้นถูก'],
    cons: ['ต้องมีบัญชี SCB', 'กองทุนมีแค่ของ SCBAM และพันธมิตร'],
  },
  {
    slug: 'jitta-wealth',
    name: 'Jitta Wealth',
    url: 'https://www.jittawealth.com',
    signupUrl: 'https://www.jittawealth.com',
    affiliateTag: '',
    categories: ['us-stock', 'fund'],
    minDeposit: '1,000 บาท',
    fees: '0.5% ต่อปี (ค่าบริหาร)',
    dcaSupport: true,
    steps: [
      'เข้าเว็บ jittawealth.com หรือดาวน์โหลดแอป',
      'สมัครสมาชิก กรอกข้อมูลส่วนตัว',
      'ตอบแบบประเมินความเสี่ยง (ระบบจัดพอร์ตให้)',
      'ยืนยันตัวตนด้วยบัตรประชาชน',
      'ฝากเงิน ระบบจะลงทุนให้อัตโนมัติ ตั้ง DCA รายเดือนได้',
    ],
    pros: ['ระบบจัดพอร์ตให้อัตโนมัติ (Robo-Advisor)', 'ลงทุนหุ้นต่างประเทศ S&P500 ได้ง่าย', 'DCA อัตโนมัติ เริ่มต้น 1,000 บาท', 'ภาษาไทย ใช้ง่าย'],
    cons: ['ค่าธรรมเนียมบริหาร 0.5%/ปี', 'เลือกหุ้นเองไม่ได้ ระบบเลือกให้', 'ถอนเงินใช้เวลา 3-5 วันทำการ'],
  },
  {
    slug: 'finnomena',
    name: 'Finnomena',
    url: 'https://www.finnomena.com',
    signupUrl: 'https://www.finnomena.com',
    affiliateTag: '',
    categories: ['fund', 'us-stock'],
    minDeposit: '500 บาท (แล้วแต่กองทุน)',
    fees: 'ไม่คิดค่าธรรมเนียมเพิ่ม (จ่ายแค่ค่าธรรมเนียมกองทุน)',
    dcaSupport: true,
    steps: [
      'เข้าเว็บ finnomena.com หรือดาวน์โหลดแอป',
      'สมัครสมาชิก กรอกข้อมูล',
      'ตอบแบบประเมินความเสี่ยง',
      'เลือกพอร์ตสำเร็จรูป หรือเลือกกองทุนเอง',
      'ฝากเงิน ตั้ง DCA รายเดือนได้ทันที',
    ],
    pros: ['กองทุนจากหลาย บลจ. ในที่เดียว', 'มีพอร์ตแนะนำสำเร็จรูป (GOAL, 1stM)', 'DCA อัตโนมัติ', 'บทความการลงทุนเยอะ'],
    cons: ['ไม่สามารถซื้อหุ้นรายตัวได้', 'ผลตอบแทนขึ้นกับกองทุนที่เลือก'],
  },
  {
    slug: 'kbank-invest',
    name: 'KBank i-invest / K-My Invest',
    url: 'https://www.kasikornasset.com',
    signupUrl: 'https://www.kasikornasset.com',
    categories: ['fund', 'us-stock'],
    minDeposit: '500 บาท',
    fees: 'ไม่คิดค่าธรรมเนียมเพิ่ม (จ่ายแค่ค่าธรรมเนียมกองทุน)',
    dcaSupport: true,
    steps: [
      'เปิดแอป K PLUS ที่มีอยู่แล้ว',
      'ไปที่เมนู "ลงทุน" หรือ "K-My Invest"',
      'ตอบแบบประเมินความเสี่ยง (ทำครั้งเดียว)',
      'เลือกกองทุน เช่น K-US500X (ลงทุน S&P500)',
      'กดซื้อ ตั้ง DCA รายเดือนได้เลย เงินหักจากบัญชี KBank',
    ],
    pros: ['ใช้ผ่าน K PLUS ที่คุ้นเคย ไม่ต้องโหลดแอปใหม่', 'เริ่มต้นแค่ 500 บาท', 'DCA หักเงินอัตโนมัติจากบัญชี', 'กองทุน KASSET หลากหลาย'],
    cons: ['ต้องมีบัญชี KBank', 'กองทุนส่วนใหญ่เป็นของ KASSET เท่านั้น', 'ไม่สามารถซื้อหุ้นรายตัวได้'],
  },
  {
    slug: 'mts-gold',
    name: 'MTS Gold',
    url: 'https://www.mtsgoldgroup.com',
    signupUrl: 'https://www.mtsgoldgroup.com',
    categories: ['gold'],
    minDeposit: '1,000 บาท (ออมทอง)',
    fees: 'Spread ราคาซื้อ-ขาย ~1-2%',
    dcaSupport: true,
    steps: [
      'เข้าเว็บ mtsgoldgroup.com หรือดาวน์โหลดแอป MTS Gold',
      'สมัครสมาชิก กรอกข้อมูลส่วนตัว',
      'ยืนยันตัวตนด้วยบัตรประชาชน',
      'เลือก "ออมทอง" เพื่อ DCA ทุกเดือนอัตโนมัติ',
      'ฝากเงิน ระบบจะซื้อทองให้ตามจำนวนที่ตั้งไว้',
    ],
    pros: ['ออมทองรายเดือนได้ (DCA ทอง)', 'เริ่มต้นแค่ 1,000 บาท', 'รับทองจริงได้เมื่อครบจำนวน', 'ราคาทองอัปเดตเรียลไทม์'],
    cons: ['Spread ราคาค่อนข้างสูง', 'ถ้าถอนเป็นเงินจะเสียส่วนต่าง', 'เป็นทองคำจริง ไม่ใช่กองทุน'],
  },
];

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  crypto: 'คริปโต',
  'thai-stock': 'หุ้นไทย',
  'us-stock': 'หุ้นต่างประเทศ',
  etf: 'ETF/ดัชนี',
  fund: 'กองทุนรวม',
  gold: 'ทองคำ',
  commodity: 'สินค้าโภคภัณฑ์',
};

export function getBroker(slug: string): Broker | undefined {
  return BROKERS.find((b) => b.slug === slug);
}

export function getBrokerLink(broker: Broker): string {
  return broker.affiliateTag
    ? `${broker.signupUrl}${broker.affiliateTag}`
    : broker.signupUrl;
}

export function getBrokersByCategory(category: AssetCategory): Broker[] {
  return BROKERS.filter((b) => b.categories.includes(category));
}
