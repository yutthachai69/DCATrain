'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatBaht } from '@/lib/format';

type Props = {
  data: Array<{ label: string; invested: number; value: number }>;
};

export default function GrowthChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={40} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatBaht(value),
            name === 'invested' ? 'เงินที่ลง' : 'มูลค่าพอร์ต',
          ]}
        />
        <Area type="monotone" dataKey="value" name="value" stroke="#059669" fill="#d1fae5" strokeWidth={2.5} />
        <Area type="monotone" dataKey="invested" name="invested" stroke="#0891b2" fill="#e0f2fe" strokeWidth={1.5} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
