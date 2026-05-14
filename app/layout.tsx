import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://dca-invest.vercel.app'),
  title: { default: 'DCA — แนะนำการลงทุนสำหรับมือใหม่', template: '%s | DCA' },
  description: 'เครื่องมือวางแผนและวิเคราะห์การลงทุนแบบ DCA สำหรับผู้เริ่มต้น ฟรี 100%',
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: 'DCA — แนะนำการลงทุน',
    title: 'DCA — เริ่มลงทุนง่ายๆ แม้ไม่รู้เรื่องเลย',
    description: 'วางแผน วิเคราะห์ และจำลองการลงทุนแบบ DCA ฟรี 100%',
  },
  twitter: { card: 'summary_large_image' },
  icons: { icon: '/LogoDCA.png', apple: '/LogoDCA.png' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="bg-slate-50 text-ink transition-colors dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-cyan-600 focus:px-4 focus:py-2 focus:text-white"
          >
            ข้ามไปเนื้อหาหลัก
          </a>
          <Header />
          <div id="main-content">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
