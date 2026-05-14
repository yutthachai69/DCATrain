import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'วิธีซื้อ — เปิดบัญชี Broker',
  description: 'เปรียบเทียบ Broker สำหรับซื้อ Crypto หุ้น กองทุน ทองคำ พร้อมขั้นตอนสมัครแบบ step-by-step',
};

export default function HowToBuyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
