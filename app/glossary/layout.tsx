import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'คลังศัพท์การลงทุน — A-Z สำหรับมือใหม่',
  description: 'รวมศัพท์การลงทุนที่ต้องรู้ อธิบายง่ายๆ พร้อมตัวอย่าง ครอบคลุม DCA, RSI, MACD, Portfolio และอีกมากมาย',
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
