import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'พอร์ตแนะนำสำหรับมือใหม่',
  description: 'พอร์ตลงทุนสำเร็จรูป 3 ระดับ: เสี่ยงต่ำ เติบโต เติบโตสูง เลือกตามความเสี่ยงที่รับได้',
};

export default function PortfoliosLayout({ children }: { children: React.ReactNode }) {
  return children;
}
