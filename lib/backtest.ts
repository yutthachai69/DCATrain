export type PriceDataPoint = {
  date: string;
  close: number;
};

export type BacktestInput = {
  monthlyAmount: number;
  prices: PriceDataPoint[];
};

export type BacktestMonth = {
  date: string;
  monthIndex: number;
  price: number;
  unitsBought: number;
  totalUnits: number;
  invested: number;
  value: number;
  gain: number;
  gainPercent: number;
};

export type BacktestResult = {
  months: BacktestMonth[];
  totalInvested: number;
  finalValue: number;
  totalGain: number;
  totalGainPercent: number;
  totalUnits: number;
  avgCostPerUnit: number;
  bestMonth: BacktestMonth;
  worstMonth: BacktestMonth;
  maxDrawdown: number;
  maxDrawdownDate: string;
};

export function backtestDCA(input: BacktestInput): BacktestResult {
  const { monthlyAmount, prices } = input;

  const monthlyPrices = groupByMonth(prices);
  if (monthlyPrices.length < 2) {
    throw new Error('ข้อมูลราคาไม่เพียงพอสำหรับ backtest (ต้องมีอย่างน้อย 2 เดือน)');
  }

  const months: BacktestMonth[] = [];
  let totalUnits = 0;
  let totalInvested = 0;
  let peak = 0;
  let maxDrawdown = 0;
  let maxDrawdownDate = '';

  if (monthlyAmount <= 0) {
    throw new Error('จำนวนเงิน DCA ต้องมากกว่า 0');
  }

  for (let i = 0; i < monthlyPrices.length; i++) {
    const { date, avgPrice } = monthlyPrices[i];
    if (avgPrice <= 0) continue;
    const unitsBought = monthlyAmount / avgPrice;
    totalUnits += unitsBought;
    totalInvested += monthlyAmount;
    const value = totalUnits * avgPrice;
    const gain = value - totalInvested;

    if (value > peak) peak = value;
    const drawdown = peak > 0 ? ((peak - value) / peak) * 100 : 0;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownDate = date;
    }

    months.push({
      date,
      monthIndex: i + 1,
      price: avgPrice,
      unitsBought,
      totalUnits,
      invested: totalInvested,
      value: Math.round(value),
      gain: Math.round(gain),
      gainPercent: totalInvested > 0 ? (gain / totalInvested) * 100 : 0,
    });
  }

  const lastMonth = months[months.length - 1];
  const rawFinalValue = lastMonth ? totalUnits * lastMonth.price : 0;
  const finalValue = Math.round(rawFinalValue);
  const totalGain = finalValue - totalInvested;
  const avgCostPerUnit = totalUnits > 0 ? totalInvested / totalUnits : 0;

  const sorted = [...months].sort((a, b) => a.gainPercent - b.gainPercent);

  return {
    months,
    totalInvested,
    finalValue,
    totalGain,
    totalGainPercent: totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0,
    totalUnits,
    avgCostPerUnit,
    bestMonth: sorted[sorted.length - 1],
    worstMonth: sorted[0],
    maxDrawdown,
    maxDrawdownDate,
  };
}

function groupByMonth(
  prices: PriceDataPoint[],
): Array<{ date: string; avgPrice: number }> {
  const groups = new Map<string, number[]>();

  for (const p of prices) {
    const monthKey = p.date.slice(0, 7);
    const arr = groups.get(monthKey) || [];
    arr.push(p.close);
    groups.set(monthKey, arr);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, closePrices]) => ({
      date,
      avgPrice: closePrices.reduce((s, v) => s + v, 0) / closePrices.length,
    }));
}
