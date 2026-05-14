'use client';

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatNumber } from '@/lib/format';

type Props = {
  data: Array<Record<string, unknown>>;
};

export default function PriceChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={30} />
        <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
        <Tooltip formatter={(value) => formatNumber(Number(value))} />
        <Line type="monotone" dataKey="close" name="ราคา" stroke="#0891b2" dot={false} strokeWidth={2.5} />
        <Line type="monotone" dataKey="ma30" name="ค่าเฉลี่ย 30 วัน" stroke="#f59e0b" dot={false} strokeWidth={1.8} />
        <Line type="monotone" dataKey="ma90" name="ค่าเฉลี่ย 90 วัน" stroke="#8b5cf6" dot={false} strokeWidth={1.8} />
      </LineChart>
    </ResponsiveContainer>
  );
}
