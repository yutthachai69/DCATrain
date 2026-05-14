export type GlossaryCategory = 'basic' | 'technical' | 'asset' | 'strategy' | 'risk';

export type GlossaryEntry = {
  term: string;
  short: string;
  long: string;
  category: GlossaryCategory;
  related?: string[];
};

export const GLOSSARY_CATEGORIES: Record<GlossaryCategory, { label: string; icon: string }> = {
  basic: { label: 'พื้นฐาน', icon: '📘' },
  technical: { label: 'เทคนิค', icon: '📊' },
  asset: { label: 'สินทรัพย์', icon: '💰' },
  strategy: { label: 'กลยุทธ์', icon: '🎯' },
  risk: { label: 'ความเสี่ยง', icon: '⚠️' },
};

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: 'DCA',
    short: 'Dollar-Cost Averaging',
    long: 'การทยอยซื้อสินทรัพย์เป็นรอบๆ ด้วยเงินเท่ากัน เช่น ซื้อทุกเดือน เดือนละ 3,000 บาท ไม่ว่าราคาจะขึ้นหรือลง ช่วยลดความเสี่ยงจากการซื้อผิดจังหวะ',
    category: 'strategy',
    related: ['Lump Sum', 'ต้นทุนเฉลี่ย'],
  },
  {
    term: 'Lump Sum',
    short: 'ลงทุนก้อนเดียวทีเดียว',
    long: 'การนำเงินทั้งหมดไปลงทุนทีเดียว ตรงข้ามกับ DCA ที่ทยอยซื้อ งานวิจัยพบว่า Lump Sum ให้ผลตอบแทนดีกว่า DCA ประมาณ 60-70% ของเวลา แต่มีความเสี่ยงจาก timing สูงกว่า',
    category: 'strategy',
    related: ['DCA'],
  },
  {
    term: 'ต้นทุนเฉลี่ย',
    short: 'Average Cost',
    long: 'ราคาเฉลี่ยที่ซื้อสินทรัพย์มา คำนวณจาก เงินลงทุนทั้งหมด ÷ จำนวนหน่วยทั้งหมด ยิ่งต้นทุนเฉลี่ยต่ำ ยิ่งมีโอกาสกำไรมากเมื่อราคาขึ้น',
    category: 'basic',
    related: ['DCA'],
  },
  {
    term: 'RSI',
    short: 'Relative Strength Index',
    long: 'ตัวเลข 0-100 ที่บอกว่าราคาขึ้นหรือลงแรงแค่ไหนในช่วงที่ผ่านมา RSI > 70 = Overbought (ขึ้นแรง อาจพักตัว) RSI < 30 = Oversold (ลงแรง อาจเด้ง)',
    category: 'technical',
    related: ['MACD', 'Overbought', 'Oversold'],
  },
  {
    term: 'MACD',
    short: 'Moving Average Convergence/Divergence',
    long: 'ตัวชี้วัดแรงส่งของราคา ใช้ดูว่าโมเมนตัมของราคากำลังแข็งแรงขึ้นหรืออ่อนลง ถ้าเส้น MACD ตัดเหนือเส้นสัญญาณ = สัญญาณบวก',
    category: 'technical',
    related: ['RSI', 'Moving Average'],
  },
  {
    term: 'Moving Average (MA)',
    short: 'เส้นค่าเฉลี่ยเคลื่อนที่',
    long: 'ราคาเฉลี่ยย้อนหลังจำนวนวันที่กำหนด เช่น MA30 = ราคาเฉลี่ย 30 วัน ใช้ดูแนวโน้มราคา ถ้าราคาอยู่เหนือ MA = แนวโน้มขาขึ้น',
    category: 'technical',
    related: ['MACD', 'Golden Cross', 'Death Cross'],
  },
  {
    term: 'ความผันผวน (Volatility)',
    short: 'ระดับการแกว่งตัวของราคา',
    long: 'ยิ่งผันผวนสูง = ราคาขึ้นลงแรงและเร็ว มีทั้งโอกาสกำไรและขาดทุนมาก Bitcoin มีความผันผวนสูงกว่าทองคำมาก',
    category: 'risk',
    related: ['Drawdown', 'Risk Score'],
  },
  {
    term: 'Drawdown',
    short: 'การลงจากจุดสูงสุด',
    long: 'เปอร์เซ็นต์ที่ราคาลงจากจุดสูงสุดที่เคยไปถึง เช่น Drawdown 30% = ราคาลงจาก ATH 30% ใช้วัดว่าสินทรัพย์เคยลงหนักแค่ไหน',
    category: 'risk',
    related: ['ความผันผวน', 'ATH'],
  },
  {
    term: 'ATH',
    short: 'All-Time High',
    long: 'ราคาสูงสุดเป็นประวัติการณ์ของสินทรัพย์ เช่น "Bitcoin ทำ ATH ใหม่ที่ $100,000"',
    category: 'basic',
    related: ['Drawdown'],
  },
  {
    term: 'Risk Score',
    short: 'คะแนนความเสี่ยง',
    long: 'คะแนน 1-10 ที่ระบบคำนวณจากข้อมูลของผู้ใช้ (อายุ รายได้ เป้าหมาย ประสบการณ์) ยิ่งสูง = รับเสี่ยงได้มาก ระบบจะแนะนำสินทรัพย์ที่เหมาะกับระดับเสี่ยงของคุณ',
    category: 'risk',
    related: ['การกระจายความเสี่ยง'],
  },
  {
    term: 'การกระจายความเสี่ยง',
    short: 'Diversification',
    long: 'การแบ่งเงินลงทุนในหลายสินทรัพย์ เช่น หุ้น + ทอง + Crypto เพื่อลดผลกระทบเมื่อสินทรัพย์ใดตัวหนึ่งลงแรง "อย่าใส่ไข่ทั้งหมดในตะกร้าใบเดียว"',
    category: 'strategy',
    related: ['Rebalance', 'พอร์ตการลงทุน'],
  },
  {
    term: 'พอร์ตการลงทุน',
    short: 'Portfolio',
    long: 'กลุ่มสินทรัพย์ทั้งหมดที่คุณลงทุนอยู่ เช่น "พอร์ตผมมี S&P500 50% ทอง 30% BTC 20%"',
    category: 'basic',
    related: ['การกระจายความเสี่ยง', 'Rebalance'],
  },
  {
    term: 'Rebalance',
    short: 'ปรับสมดุลพอร์ต',
    long: 'การปรับสัดส่วนสินทรัพย์ในพอร์ตกลับมาตามแผนเดิม เช่น ถ้า BTC ขึ้นจน 30% กลายเป็น 40% ของพอร์ต ก็ขายบางส่วนแล้วซื้อตัวอื่นเพิ่ม สำหรับมือใหม่ Rebalance ปีละ 1 ครั้งก็พอ',
    category: 'strategy',
    related: ['พอร์ตการลงทุน', 'การกระจายความเสี่ยง'],
  },
  {
    term: 'Overbought',
    short: 'ซื้อมากเกินไป',
    long: 'สภาวะที่ราคาขึ้นเร็วและแรงเกินไป (RSI > 70) อาจมีช่วงพักตัวหรือย่อลง แต่ไม่ได้หมายความว่าจะลงเสมอ',
    category: 'technical',
    related: ['RSI', 'Oversold'],
  },
  {
    term: 'Oversold',
    short: 'ขายมากเกินไป',
    long: 'สภาวะที่ราคาลงเร็วและแรงเกินไป (RSI < 30) อาจเด้งกลับขึ้น สำหรับ DCA ช่วง Oversold ถือเป็นจังหวะที่ดีในการสะสม',
    category: 'technical',
    related: ['RSI', 'Overbought'],
  },
  {
    term: 'S&P 500',
    short: 'ดัชนีหุ้น 500 บริษัทใหญ่สุดในสหรัฐ',
    long: 'ดัชนีที่รวม 500 บริษัทใหญ่ที่สุดในตลาดหุ้นสหรัฐ เช่น Apple, Google, Microsoft, Amazon ให้ผลตอบแทนเฉลี่ย 8-12% ต่อปี ถือเป็นตัวเลือกยอดนิยมสำหรับมือใหม่',
    category: 'asset',
    related: ['ETF', 'กองทุนดัชนี'],
  },
  {
    term: 'ETF',
    short: 'Exchange-Traded Fund',
    long: 'กองทุนที่ซื้อขายได้ในตลาดหุ้นเหมือนหุ้นทั่วไป แต่ภายในกระจายลงทุนหลายตัว เช่น ETF ที่ตาม S&P500 จะมีหุ้น 500 ตัวอยู่ข้างใน',
    category: 'asset',
    related: ['S&P 500', 'กองทุนดัชนี'],
  },
  {
    term: 'กองทุนดัชนี',
    short: 'Index Fund',
    long: 'กองทุนที่ลงทุนตามดัชนีใดดัชนีหนึ่ง เช่น กองทุน S&P500 จะลงทุนตาม 500 บริษัทในดัชนี ค่าธรรมเนียมต่ำกว่ากองทุน Active ที่มีผู้จัดการเลือกหุ้น',
    category: 'asset',
    related: ['ETF', 'S&P 500'],
  },
  {
    term: 'Stablecoin',
    short: 'เหรียญ Crypto ที่ผูกค่ากับสกุลเงิน',
    long: 'เช่น USDT, USDC ที่ผูกค่า 1:1 กับ USD ใช้เป็นที่พักเงินในโลก Crypto เมื่อไม่อยากถือเหรียญที่ผันผวน ราคาแทบไม่เปลี่ยน',
    category: 'asset',
    related: ['Bitcoin', 'Ethereum'],
  },
  {
    term: 'FOMO',
    short: 'Fear Of Missing Out',
    long: 'ความกลัวที่จะพลาดโอกาส เช่น เห็นคนอื่นได้กำไรแล้วรีบซื้อตาม โดยไม่ศึกษาก่อน เป็นสาเหตุหลักที่ทำให้มือใหม่ซื้อตอนราคาสูงสุด',
    category: 'risk',
    related: ['Panic Sell'],
  },
  {
    term: 'Panic Sell',
    short: 'ขายตอนตกใจ',
    long: 'การรีบขายสินทรัพย์ทันทีเมื่อราคาลงแรง เพราะกลัวจะลงไปอีก ทำให้ล็อคขาดทุนจริง ถ้ามีแผน DCA ที่ดี ไม่ควรตกใจขาย',
    category: 'risk',
    related: ['FOMO', 'Drawdown'],
  },
  {
    term: 'Golden Cross',
    short: 'เส้น MA สั้นตัดขึ้นเหนือเส้น MA ยาว',
    long: 'เช่น MA50 ตัดขึ้นเหนือ MA200 มักเป็นสัญญาณบวกว่าแนวโน้มกำลังเปลี่ยนเป็นขาขึ้น แต่ไม่ใช่สัญญาณซื้อขาย 100%',
    category: 'technical',
    related: ['Death Cross', 'Moving Average'],
  },
  {
    term: 'Death Cross',
    short: 'เส้น MA สั้นตัดลงใต้เส้น MA ยาว',
    long: 'เช่น MA50 ตัดลงใต้ MA200 มักเป็นสัญญาณลบว่าแนวโน้มกำลังเปลี่ยนเป็นขาลง ตรงข้ามกับ Golden Cross',
    category: 'technical',
    related: ['Golden Cross', 'Moving Average'],
  },
  {
    term: 'เงินสำรองฉุกเฉิน',
    short: 'Emergency Fund',
    long: 'เงินที่เก็บไว้สำหรับเหตุไม่คาดคิด (ป่วย ตกงาน ของพัง) ควรมีอย่างน้อย 3-6 เดือนของค่าใช้จ่าย ต้องมีก่อนเริ่มลงทุน',
    category: 'basic',
    related: ['Risk Score'],
  },
  {
    term: 'เงินเฟ้อ',
    short: 'Inflation',
    long: 'การเพิ่มขึ้นของราคาสินค้าทั่วไป ทำให้เงินซื้อของได้น้อยลงเรื่อยๆ ถ้าไม่ลงทุนเลย เงินฝากที่ได้ดอกเบี้ย 1% แต่เงินเฟ้อ 3% = ขาดทุนจริง 2% ต่อปี',
    category: 'basic',
    related: ['ต้นทุนเฉลี่ย'],
  },
];

export function searchGlossary(query: string): GlossaryEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return GLOSSARY_ENTRIES;
  return GLOSSARY_ENTRIES.filter(
    (entry) =>
      entry.term.toLowerCase().includes(q) ||
      entry.short.toLowerCase().includes(q) ||
      entry.long.toLowerCase().includes(q),
  );
}
