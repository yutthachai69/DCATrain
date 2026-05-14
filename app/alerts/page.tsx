'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ASSETS, TAG_CONFIG } from '@/lib/assets';
import {
  type PriceAlert,
  type AlertCondition,
  CONDITION_LABELS,
  loadAlerts,
  addAlert,
  removeAlert,
  checkAlerts,
} from '@/lib/alerts';
import { formatNumber } from '@/lib/format';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [newAsset, setNewAsset] = useState('BTC');
  const [newCondition, setNewCondition] = useState<AlertCondition>('below');
  const [newPrice, setNewPrice] = useState('');

  const fetchPrices = useCallback(async (alertList: PriceAlert[]) => {
    const activeAssets = Array.from(new Set(alertList.filter((a) => !a.triggered).map((a) => a.assetKey)));
    if (activeAssets.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const priceMap: Record<string, number> = {};
    await Promise.allSettled(
      activeAssets.map(async (assetKey) => {
        try {
          const res = await fetch(`/api/analysis?asset=${encodeURIComponent(assetKey)}&days=120`);
          if (!res.ok) return;
          const data = await res.json();
          priceMap[assetKey] = data.analysis?.latestPrice ?? 0;
        } catch { /* skip */ }
      }),
    );

    setPrices(priceMap);
    const updated = checkAlerts(alertList, priceMap);
    setAlerts(updated);
    setLoading(false);
  }, []);

  useEffect(() => {
    const saved = loadAlerts();
    setAlerts(saved);
    if (saved.length > 0) {
      fetchPrices(saved);
    } else {
      setLoading(false);
    }
  }, [fetchPrices]);

  function handleAdd() {
    const price = parseFloat(newPrice);
    if (!price || price <= 0) return;
    const updated = addAlert(alerts, newAsset, newCondition, price);
    setAlerts(updated);
    setNewPrice('');
    fetchPrices(updated);
  }

  function handleRemove(id: string) {
    setAlerts(removeAlert(alerts, id));
  }

  const activeAlerts = alerts.filter((a) => !a.triggered);
  const triggeredAlerts = alerts.filter((a) => a.triggered);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 px-5 py-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/85">
          <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">แจ้งเตือนราคา</p>
          <h1 className="mt-1 text-2xl font-bold text-ink md:text-3xl">ตั้งเป้าราคาสินทรัพย์</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            ระบบจะตรวจสอบราคาทุกครั้งที่คุณเปิดหน้านี้ และแจ้งเตือนเมื่อราคาถึงเป้า
          </p>
        </section>

        {/* Add Alert Form */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-bold text-ink">เพิ่มการแจ้งเตือน</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              สินทรัพย์
              <select
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                value={newAsset}
                onChange={(e) => setNewAsset(e.target.value)}
              >
                {Object.entries(ASSETS).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.tags.includes('beginner') ? `⭐ ${key}` : key} — {cfg.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              เงื่อนไข
              <select
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value as AlertCondition)}
              >
                <option value="below">ราคาต่ำกว่า</option>
                <option value="above">ราคาสูงกว่า</option>
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              ราคาเป้า
              <input
                type="number"
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                placeholder="เช่น 90000"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                min={0}
                step="any"
              />
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!newPrice || parseFloat(newPrice) <= 0}
                className="w-full rounded-xl bg-cyan-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                + เพิ่ม
              </button>
            </div>
          </div>

          {prices[newAsset] !== undefined && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              ราคาปัจจุบัน {newAsset}: {formatNumber(prices[newAsset])}
            </p>
          )}
        </section>

        {/* Active Alerts */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-bold text-ink">การแจ้งเตือนที่กำลังเฝ้าดู ({activeAlerts.length})</h2>

          {loading && activeAlerts.length === 0 && (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">กำลังตรวจสอบราคา...</p>
          )}

          {!loading && activeAlerts.length === 0 && (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">ยังไม่มีการแจ้งเตือน เพิ่มได้จากฟอร์มด้านบน</p>
          )}

          <div className="mt-4 space-y-3">
            {activeAlerts.map((alert) => {
              const asset = ASSETS[alert.assetKey];
              const currentPrice = prices[alert.assetKey];
              return (
                <div key={alert.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-700/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-ink">{alert.assetKey}</p>
                      {asset && <span className="text-sm text-slate-500 dark:text-slate-400">{asset.name}</span>}
                      {asset?.tags.includes('beginner') && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TAG_CONFIG.beginner.color}`}>
                          {TAG_CONFIG.beginner.label}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      แจ้งเตือนเมื่อราคา{CONDITION_LABELS[alert.condition]} <b>{formatNumber(alert.targetPrice)}</b>
                      {currentPrice !== undefined && (
                        <span className="ml-2 text-xs text-slate-400">
                          (ตอนนี้: {formatNumber(currentPrice)})
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(alert.id)}
                    className="shrink-0 rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  >
                    ลบ
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm dark:border-emerald-800 dark:bg-emerald-950">
            <h2 className="font-bold text-emerald-800 dark:text-emerald-300">ถึงเป้าแล้ว! ({triggeredAlerts.length})</h2>
            <div className="mt-4 space-y-3">
              {triggeredAlerts.map((alert) => {
                const asset = ASSETS[alert.assetKey];
                return (
                  <div key={alert.id} className="flex items-center justify-between rounded-xl border border-emerald-200 bg-white p-4 dark:border-emerald-700 dark:bg-emerald-900/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🔔</span>
                        <p className="font-bold text-ink">{alert.assetKey}</p>
                        {asset && <span className="text-sm text-slate-500 dark:text-slate-400">{asset.name}</span>}
                      </div>
                      <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                        ราคา{CONDITION_LABELS[alert.condition]} {formatNumber(alert.targetPrice)} แล้ว!
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/analyzer?asset=${encodeURIComponent(alert.assetKey)}`}
                        className="rounded-lg bg-cyan-600 px-3 py-1 text-xs font-bold text-white transition hover:bg-cyan-700"
                      >
                        วิเคราะห์
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(alert.id)}
                        className="rounded-lg border border-slate-300 px-3 py-1 text-xs text-slate-600 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Info */}
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950">
          <h3 className="font-bold text-amber-800 dark:text-amber-300">ข้อควรรู้</h3>
          <ul className="mt-2 space-y-1 text-sm text-amber-700 dark:text-amber-400">
            <li>- ระบบตรวจสอบราคาเมื่อคุณเปิดหน้านี้เท่านั้น (ไม่ใช่ push notification)</li>
            <li>- ข้อมูลเก็บไว้ใน browser ของคุณ ไม่ส่งไปที่ server ใดๆ</li>
            <li>- ราคาอาจมีความล่าช้า 5-15 นาทีจากตลาดจริง</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
