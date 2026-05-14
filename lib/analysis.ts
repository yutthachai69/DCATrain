export type PricePoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type EnrichedPoint = PricePoint & {
  ma30: number | null;
  ma90: number | null;
  rsi: number | null;
  macd: number | null;
  macdSignal: number | null;
  volatility: number | null;
};

export type Analysis = {
  signal: 'ซื้อได้' | 'รอก่อน' | 'หลีกเลี่ยง';
  score: number;
  latestPrice: number;
  change30d: number | null;
  change90d: number | null;
  rsi: number;
  macd: number;
  macdSignal: number;
  volatility: number;
  ma30: number;
  ma90: number;
  reasons: string[];
  cautions: string[];
  advice: string;
  frame: EnrichedPoint[];
};

export function analyzeAsset(data: PricePoint[]): Analysis {
  const frame = addIndicators(data).filter((point) => point.ma90 !== null && point.rsi !== null && point.macd !== null && point.macdSignal !== null && point.volatility !== null);
  if (frame.length < 30) {
    throw new Error('ข้อมูลยังไม่พอสำหรับวิเคราะห์แนวโน้ม');
  }

  const latest = frame[frame.length - 1];
  const previous = frame[frame.length - 2];
  let score = 0;
  const reasons: string[] = [];
  const cautions: string[] = [];

  if (latest.close > latest.ma30! && latest.ma30! > latest.ma90!) {
    score += 2;
    reasons.push('ราคาอยู่เหนือค่าเฉลี่ย 30 และ 90 วัน แปลว่าแนวโน้มโดยรวมยังดูแข็งแรง');
  } else if (latest.close < latest.ma30! && latest.ma30! < latest.ma90!) {
    score -= 2;
    cautions.push('ราคาอยู่ต่ำกว่าค่าเฉลี่ยสำคัญ แนวโน้มยังอ่อนแรง');
  } else {
    reasons.push('แนวโน้มยังไม่ชัดเจน ราคาแกว่งใกล้ค่าเฉลี่ย');
  }

  if (latest.rsi! >= 45 && latest.rsi! <= 65) {
    score += 1;
    reasons.push('RSI อยู่ในโซนกลาง ยังไม่ร้อนแรงเกินไป');
  } else if (latest.rsi! > 70) {
    score -= 1;
    cautions.push('RSI สูงกว่า 70 อาจเริ่มแพงหรือถูกซื้อมากเกินไป');
  } else if (latest.rsi! < 30) {
    score -= 1;
    cautions.push('RSI ต่ำกว่า 30 แปลว่าราคาลงแรง ควรรอสัญญาณฟื้นตัวก่อน');
  }

  if (latest.macd! > latest.macdSignal! && previous.macd! <= previous.macdSignal!) {
    score += 1;
    reasons.push('MACD เพิ่งตัดขึ้น เป็นสัญญาณบวกในระยะสั้น');
  } else if (latest.macd! < latest.macdSignal!) {
    score -= 1;
    cautions.push('MACD ยังต่ำกว่าเส้นสัญญาณ โมเมนตัมระยะสั้นยังไม่ดี');
  }

  if (latest.volatility! > 0.75) {
    score -= 1;
    cautions.push('ความผันผวนสูงมาก เหมาะกับเงินเย็นและควรแบ่งไม้');
  } else if (latest.volatility! < 0.25) {
    score += 1;
    reasons.push('ความผันผวนไม่สูงมากเมื่อเทียบกับสินทรัพย์เสี่ยง');
  }

  const signal = signalFromScore(score);
  return {
    signal,
    score,
    latestPrice: latest.close,
    change30d: periodChange(frame, 30),
    change90d: periodChange(frame, 90),
    rsi: latest.rsi!,
    macd: latest.macd!,
    macdSignal: latest.macdSignal!,
    volatility: latest.volatility!,
    ma30: latest.ma30!,
    ma90: latest.ma90!,
    reasons,
    cautions,
    advice: plainThaiAdvice(signal),
    frame,
  };
}

export function addIndicators(data: PricePoint[]): EnrichedPoint[] {
  const closes = data.map((point) => point.close);
  const ma30 = rollingMean(closes, 30);
  const ma90 = rollingMean(closes, 90);
  const rsi = calculateRsi(closes, 14);
  const ema12 = ema(closes, 12);
  const ema26 = ema(closes, 26);
  const macd = closes.map((_, index) => ema12[index] - ema26[index]);
  const macdSignal = ema(macd, 9);
  const returns = closes.map((close, index) => (index === 0 ? null : close / closes[index - 1] - 1));
  const volatility = rollingStd(returns, 30).map((value) => (value === null ? null : value * Math.sqrt(252)));

  return data.map((point, index) => ({
    ...point,
    ma30: ma30[index],
    ma90: ma90[index],
    rsi: rsi[index],
    macd: macd[index],
    macdSignal: macdSignal[index],
    volatility: volatility[index],
  }));
}

function rollingMean(values: number[], period: number): Array<number | null> {
  return values.map((_, index) => {
    if (index + 1 < period) return null;
    const slice = values.slice(index + 1 - period, index + 1);
    return slice.reduce((sum, value) => sum + value, 0) / period;
  });
}

function rollingStd(values: Array<number | null>, period: number): Array<number | null> {
  return values.map((_, index) => {
    if (index + 1 < period) return null;
    const slice = values.slice(index + 1 - period, index + 1).filter((value): value is number => value !== null);
    if (slice.length < period) return null;
    const mean = slice.reduce((sum, value) => sum + value, 0) / period;
    const variance = slice.reduce((sum, value) => sum + (value - mean) ** 2, 0) / period;
    return Math.sqrt(variance);
  });
}

function ema(values: number[], period: number): number[] {
  const multiplier = 2 / (period + 1);
  return values.reduce<number[]>((result, value, index) => {
    result.push(index === 0 ? value : value * multiplier + result[index - 1] * (1 - multiplier));
    return result;
  }, []);
}

function calculateRsi(closes: number[], period: number): Array<number | null> {
  return closes.map((_, index) => {
    if (index < period) return null;
    const deltas = closes.slice(index + 1 - period, index + 1).map((close, deltaIndex, slice) => (deltaIndex === 0 ? 0 : close - slice[deltaIndex - 1]));
    const gains = deltas.map((delta) => Math.max(delta, 0));
    const losses = deltas.map((delta) => Math.max(-delta, 0));
    const averageGain = gains.reduce((sum, value) => sum + value, 0) / period;
    const averageLoss = losses.reduce((sum, value) => sum + value, 0) / period;
    if (averageLoss === 0) return 100;
    const rs = averageGain / averageLoss;
    return 100 - 100 / (1 + rs);
  });
}

function periodChange(frame: EnrichedPoint[], days: number): number | null {
  if (frame.length <= days) return null;
  return (frame[frame.length - 1].close / frame[frame.length - days].close - 1) * 100;
}

function signalFromScore(score: number): Analysis['signal'] {
  if (score >= 3) return 'ซื้อได้';
  if (score >= 0) return 'รอก่อน';
  return 'หลีกเลี่ยง';
}

function plainThaiAdvice(signal: Analysis['signal']): string {
  if (signal === 'ซื้อได้') return 'ภาพรวมค่อนข้างดี ถ้าต้องการลงทุนควรทยอยซื้อแบบ DCA ไม่จำเป็นต้องซื้อทั้งหมดครั้งเดียว';
  if (signal === 'รอก่อน') return 'ยังไม่ใช่จังหวะที่ชัดเจน ควรรอดูราคาและสัญญาณอีกระยะ หรือทยอยน้อยกว่าปกติ';
  return 'ความเสี่ยงตอนนี้ค่อนข้างสูง สำหรับมือใหม่ควรหลีกเลี่ยงหรือรอให้แนวโน้มดีขึ้นก่อน';
}
