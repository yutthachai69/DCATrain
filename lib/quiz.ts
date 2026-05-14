export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'DCA ย่อมาจากอะไร?',
    options: ['Dollar-Cost Averaging', 'Digital Currency Account', 'Daily Compound Asset', 'Decentralized Crypto Asset'],
    correctIndex: 0,
    explanation: 'DCA ย่อมาจาก Dollar-Cost Averaging คือการทยอยซื้อสินทรัพย์เป็นรอบๆ ด้วยเงินเท่ากัน',
  },
  {
    id: 2,
    question: 'ข้อดีหลักของ DCA คือ?',
    options: ['ได้กำไร 100% ทุกครั้ง', 'ไม่ต้องจับจังหวะตลาด', 'ไม่มีค่าธรรมเนียม', 'ราคาจะขึ้นเสมอ'],
    correctIndex: 1,
    explanation: 'DCA ช่วยลดความเสี่ยงจากการซื้อผิดจังหวะ เพราะซื้อทุกเดือนเท่ากัน ได้ต้นทุนเฉลี่ย',
  },
  {
    id: 3,
    question: 'ก่อนเริ่มลงทุน ควรมีเงินสำรองฉุกเฉินกี่เดือน?',
    options: ['ไม่จำเป็น', '1 เดือน', '3-6 เดือน', '3 ปี'],
    correctIndex: 2,
    explanation: 'ควรมีเงินสำรองฉุกเฉิน 3-6 เดือนของค่าใช้จ่าย เพื่อรองรับเหตุไม่คาดคิดโดยไม่ต้องขายการลงทุน',
  },
  {
    id: 4,
    question: 'RSI ค่า 80 หมายความว่าอะไร?',
    options: ['ราคาถูกมาก น่าซื้อ', 'ตลาดปิด', 'ราคาขึ้นแรง อาจเริ่มแพง', 'ข้อมูลไม่เพียงพอ'],
    correctIndex: 2,
    explanation: 'RSI > 70 หมายถึง Overbought ราคาขึ้นแรง อาจมีช่วงพักตัว แต่ไม่ได้แปลว่าต้องลงเสมอ',
  },
  {
    id: 5,
    question: 'สินทรัพย์ไหนผันผวนน้อยที่สุด?',
    options: ['Bitcoin', 'Dogecoin', 'Tesla', 'ทองคำ'],
    correctIndex: 3,
    explanation: 'ทองคำเป็นสินทรัพย์ปลอดภัย (safe-haven) ผันผวนน้อยกว่า crypto และหุ้นรายตัว',
  },
  {
    id: 6,
    question: 'การกระจายความเสี่ยง (Diversification) คือ?',
    options: ['ลงทุนเยอะๆ ในตัวเดียว', 'แบ่งเงินลงทุนในหลายสินทรัพย์', 'ขายทุกอย่างเมื่อตลาดลง', 'ซื้อตามคนดัง'],
    correctIndex: 1,
    explanation: 'การกระจายความเสี่ยงคือการไม่ใส่ไข่ทั้งหมดในตะกร้าใบเดียว ถ้าตัวหนึ่งลง ตัวอื่นอาจช่วยรับได้',
  },
  {
    id: 7,
    question: 'ถ้ามีหนี้บัตรเครดิตดอกเบี้ย 18% ควรทำอะไรก่อน?',
    options: ['ลงทุน crypto ให้ได้ 50% มาปิดหนี้', 'ไม่ต้องสนใจ ลงทุนเลย', 'กู้เพิ่มมาลงทุน', 'ปิดหนี้ก่อนแล้วค่อยลงทุน'],
    correctIndex: 3,
    explanation: 'หนี้ดอกเบี้ยสูง (12%+) ควรปิดก่อน เพราะดอกเบี้ยหนี้มักสูงกว่าผลตอบแทนจากการลงทุน',
  },
  {
    id: 8,
    question: 'S&P 500 คืออะไร?',
    options: ['รถรุ่นใหม่', 'สกุลเงินดิจิทัล', 'กองทุนทองคำ', 'ดัชนีหุ้น 500 บริษัทใหญ่ที่สุดในสหรัฐ'],
    correctIndex: 3,
    explanation: 'S&P 500 คือดัชนีที่รวม 500 บริษัทใหญ่ที่สุดในสหรัฐ เช่น Apple, Google, Microsoft เหมาะกับมือใหม่เพราะกระจายความเสี่ยงดี',
  },
  {
    id: 9,
    question: 'เมื่อราคาสินทรัพย์ลง 30% ระหว่าง DCA ควรทำอย่างไร?',
    options: ['ขายทิ้งทันที', 'กู้เงินมาซื้อเพิ่ม', 'ซื้อเพิ่มตามแผน DCA ปกติ', 'โทรบ่นโบรกเกอร์'],
    correctIndex: 2,
    explanation: 'ข้อดีของ DCA คือเมื่อราคาลง คุณจะได้หน่วยเยอะขึ้น ทำให้ต้นทุนเฉลี่ยลดลง ซื้อตามแผนต่อไป',
  },
  {
    id: 10,
    question: 'ข้อไหนเป็นสัญญาณอันตรายของการลงทุนหลอก?',
    options: ['ผลตอบแทน 8-12% ต่อปี', 'ต้องศึกษาก่อนลงทุน', 'การันตีกำไร 10% ต่อเดือน', 'มีความเสี่ยงขาดทุน'],
    correctIndex: 2,
    explanation: 'ไม่มีการลงทุนไหนที่การันตีกำไรได้ ถ้าใครบอกว่า "การันตี 10% ต่อเดือน" หรือ "ไม่มีความเสี่ยง" → เป็นแชร์ลูกโซ่หรือหลอกลวง 100%',
  },
];

export type QuizLevel = 'beginner' | 'intermediate' | 'confident';

export const QUIZ_LEVELS: Record<QuizLevel, { label: string; min: number; color: string }> = {
  beginner: { label: 'มือใหม่หัดลงทุน', min: 0, color: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950 dark:border-amber-800' },
  intermediate: { label: 'นักลงทุนฝึกหัด', min: 6, color: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800' },
  confident: { label: 'นักลงทุนมั่นใจ', min: 9, color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950 dark:border-emerald-800' },
};

export function getQuizLevel(score: number): QuizLevel {
  if (score >= QUIZ_LEVELS.confident.min) return 'confident';
  if (score >= QUIZ_LEVELS.intermediate.min) return 'intermediate';
  return 'beginner';
}

const QUIZ_STORAGE_KEY = 'dca-quiz-best-score';

export function loadBestScore(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return Number(window.localStorage.getItem(QUIZ_STORAGE_KEY) || 0);
  } catch {
    return 0;
  }
}

export function saveBestScore(score: number) {
  if (typeof window === 'undefined') return;
  const current = loadBestScore();
  if (score > current) {
    window.localStorage.setItem(QUIZ_STORAGE_KEY, String(score));
  }
}
