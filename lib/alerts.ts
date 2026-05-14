export type AlertCondition = 'below' | 'above';

export type PriceAlert = {
  id: string;
  assetKey: string;
  condition: AlertCondition;
  targetPrice: number;
  createdAt: string;
  triggered: boolean;
  triggeredAt?: string;
};

const STORAGE_KEY = 'dca-price-alerts';

export function loadAlerts(): PriceAlert[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PriceAlert[];
  } catch {
    return [];
  }
}

export function saveAlerts(alerts: PriceAlert[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
}

export function addAlert(
  alerts: PriceAlert[],
  assetKey: string,
  condition: AlertCondition,
  targetPrice: number,
): PriceAlert[] {
  const newAlert: PriceAlert = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    assetKey,
    condition,
    targetPrice,
    createdAt: new Date().toISOString(),
    triggered: false,
  };
  const updated = [...alerts, newAlert];
  saveAlerts(updated);
  return updated;
}

export function removeAlert(alerts: PriceAlert[], id: string): PriceAlert[] {
  const updated = alerts.filter((a) => a.id !== id);
  saveAlerts(updated);
  return updated;
}

export function checkAlerts(
  alerts: PriceAlert[],
  prices: Record<string, number>,
): PriceAlert[] {
  let changed = false;
  const updated = alerts.map((alert) => {
    if (alert.triggered) return alert;
    const currentPrice = prices[alert.assetKey];
    if (currentPrice === undefined) return alert;

    const shouldTrigger =
      (alert.condition === 'below' && currentPrice <= alert.targetPrice) ||
      (alert.condition === 'above' && currentPrice >= alert.targetPrice);

    if (shouldTrigger) {
      changed = true;
      return { ...alert, triggered: true, triggeredAt: new Date().toISOString() };
    }
    return alert;
  });

  if (changed) saveAlerts(updated);
  return updated;
}

export const CONDITION_LABELS: Record<AlertCondition, string> = {
  below: 'ต่ำกว่า',
  above: 'สูงกว่า',
};
