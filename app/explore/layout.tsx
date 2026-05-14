import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'สำรวจสินทรัพย์',
  description: 'สำรวจ Crypto หุ้นไทย หุ้น US ETF ทองคำ กองทุน พร้อมคำอธิบายแบบเข้าใจง่ายสำหรับมือใหม่',
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
