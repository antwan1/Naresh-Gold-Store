import { useEffect, useState, useCallback } from 'react';
import { getGoldPrices } from '../services/api';
import type { GoldPrices } from '../types';

const REFRESH_MS = 15 * 60 * 1000; // 15 minutes

export default function GoldTicker() {
  const [prices, setPrices] = useState<GoldPrices | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const data = await getGoldPrices();
      setPrices(data);
    } catch {
      // silently fail — ticker just won't show
    }
  }, []);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  if (!prices) return null;

  const items = [
    { label: 'Gold 24K', value: prices.gold_per_gram['24k'] },
    { label: 'Gold 22K', value: prices.gold_per_gram['22k'] },
    { label: 'Gold 18K', value: prices.gold_per_gram['18k'] },
    { label: 'Silver', value: prices.silver_per_gram },
  ];

  return (
    <div
      data-testid="gold-ticker"
      className="w-full flex items-center justify-center gap-6 px-4 py-1.5 text-xs overflow-x-auto"
      style={{
        backgroundColor: '#0F1328',
        fontFamily: 'var(--font-body)',
        whiteSpace: 'nowrap',
      }}
    >
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5 flex-shrink-0">
          <span style={{ color: '#C9A84C', fontWeight: 600 }}>{item.label}</span>
          <span style={{ color: '#E5E7EB' }}>
            £{item.value.toFixed(2)}<span style={{ color: '#9CA3AF' }}>/g</span>
          </span>
        </span>
      ))}
      <span style={{ color: '#4B5563', fontSize: 10 }}>Live prices · {prices.currency}</span>
    </div>
  );
}
