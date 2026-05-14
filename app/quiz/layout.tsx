import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ทดสอบความรู้การลงทุน — Quiz 10 ข้อ',
  description: 'ทดสอบว่าคุณรู้เรื่องการลงทุนแค่ไหน ด้วย Quiz 10 ข้อ พร้อมคำอธิบายทุกข้อ',
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return children;
}
