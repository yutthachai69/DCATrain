import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เปรียบเทียบสินทรัพย์',
  description: 'เปรียบเทียบ 2 สินทรัพย์ข้างกัน ดูสัญญาณ ความเสี่ยง และผลตอบแทน',
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
