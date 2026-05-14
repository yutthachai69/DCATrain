import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'แจ้งเตือนราคา — ตั้งเป้าราคาสินทรัพย์',
  description: 'ตั้งแจ้งเตือนเมื่อราคาสินทรัพย์ถึงเป้าที่คุณกำหนด',
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
