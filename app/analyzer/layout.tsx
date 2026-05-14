import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'วิเคราะห์สินทรัพย์',
  description: 'วิเคราะห์ราคา BTC, ETH, AAPL, PTT, ทอง, S&P500 แบบเข้าใจง่าย พร้อมสัญญาณซื้อ/รอ/หลีกเลี่ยง',
};

export default function AnalyzerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
