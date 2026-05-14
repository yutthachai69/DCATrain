import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'จำลอง DCA',
  description: 'จำลองผลลัพธ์การลงทุนแบบ DCA ปรับเงินลงทุน ระยะเวลา และผลตอบแทนได้เอง',
};

export default function SimulatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
