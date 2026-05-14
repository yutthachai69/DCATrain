# DCA - เครื่องมือวิเคราะห์การลงทุนส่วนตัว

เว็บแอปสำหรับวิเคราะห์สินทรัพย์และวางแผนการลงทุนแบบ DCA (Dollar-Cost Averaging) สำหรับผู้เริ่มต้น

**ฟรี 100% ไม่ใช้ AI API** — วิเคราะห์ด้วยสูตรคณิตศาสตร์ล้วน

## Features

### วางแผนส่วนตัว
- แบบสอบถามข้อมูลการเงิน (รายรับ, รายจ่าย, เงินออม, หนี้สิน)
- ประเมิน Risk Score และแนะนำสัดส่วน Portfolio
- คำนวณเป้าหมายการลงทุนรายเดือน

### วิเคราะห์สินทรัพย์
- ดึงข้อมูลราคาแบบ Real-time จาก CoinGecko และ Yahoo Finance
- วิเคราะห์ Technical Indicators: RSI, MACD, MA30/MA90, Volatility
- แสดงสัญญาณ: ซื้อได้ / รอก่อน / หลีกเลี่ยง
- รองรับ 6 สินทรัพย์: BTC, ETH, AAPL, PTT.BK, Gold, S&P 500

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Data:** CoinGecko API, Yahoo Finance API

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repository-url>
cd DCA
npm install
```

### Development

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

### Build

```bash
npm run build
npm start
```

## Project Structure

```
DCA/
├── app/
│   ├── api/analysis/route.ts   # API endpoint
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   └── Dashboard.tsx           # Main UI component
├── lib/
│   ├── analysis.ts             # Technical analysis engine
│   └── assets.ts               # Asset registry
└── __tests__/
    └── analysis.test.ts        # Unit tests
```

## License

MIT
