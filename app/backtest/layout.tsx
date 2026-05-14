import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Backtest DCA — ทดสอบย้อนหลังด้วยราคาจริง',
  description:
    'จำลองว่าถ้า DCA สินทรัพย์ที่เลือกตั้งแต่อดีต จะได้ผลตอบแทนเท่าไหร่ ใช้ข้อมูลราคาจริง',
};

export default function BacktestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
