export function formatBaht(value: number) {
  return `${formatNumber(Math.round(value))} ฿`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('th-TH', { maximumFractionDigits: 2 }).format(value);
}

export function formatPercent(value: number | null) {
  if (value === null || Number.isNaN(value)) return '-';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}
