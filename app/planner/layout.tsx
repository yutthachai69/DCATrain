import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'วางแผนการลงทุน',
  description: 'ตอบคำถามง่ายๆ 4 ขั้นตอน ระบบจะคำนวณแผนลงทุน DCA ที่เหมาะกับคุณ',
};

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
