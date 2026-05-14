'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

type BacktestDataPoint = {
  date: string;
  invested: number;
  value: number;
};

export default function BacktestChart({ data }: { data: BacktestDataPoint[] }) {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-slate-400">ไม่มีข้อมูลสำหรับกราฟ</div>;
  }
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11 }}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1_000_000
              ? `${(v / 1_000_000).toFixed(1)}M`
              : v >= 1000
                ? `${(v / 1000).toFixed(0)}K`
                : String(v)
          }
        />
        <Tooltip
          formatter={(v: number, name: string) => [
            v.toLocaleString('th-TH', { maximumFractionDigits: 0 }),
            name === 'invested' ? 'ลงทุนสะสม' : 'มูลค่า',
          ]}
          labelFormatter={(label: string) => `เดือน ${label}`}
        />
        <Legend
          formatter={(value: string) => (value === 'invested' ? 'ลงทุนสะสม' : 'มูลค่าพอร์ต')}
        />
        <Area
          type="monotone"
          dataKey="invested"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
