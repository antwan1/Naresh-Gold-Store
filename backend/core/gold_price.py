"""Shared live gold/silver price cache used by views and serializers."""
import time
import urllib.request
import json
import logging
import re

logger = logging.getLogger(__name__)

_cache: tuple[float, dict] | None = None
_CACHE_TTL = 900  # 15 minutes
_TROY_OZ_TO_GRAM = 31.1035

_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
}


def _yahoo(symbol: str) -> float | None:
    url = f'https://query2.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d'
    try:
        req = urllib.request.Request(url, headers=_HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        return float(data['chart']['result'][0]['meta']['regularMarketPrice'])
    except Exception as e:
        logger.warning('Yahoo Finance %s failed: %s', symbol, e)
        return None


def get_prices() -> dict:
    """Return cached gold/silver prices, refreshing if stale."""
    global _cache
    now = time.time()
    if _cache and (now - _cache[0]) < _CACHE_TTL:
        return _cache[1]

    gold_usd_oz = _yahoo('GC=F')
    gbp_per_usd = _yahoo('GBPUSD=X')

    if gold_usd_oz and gbp_per_usd:
        gold_g = (gold_usd_oz / gbp_per_usd) / _TROY_OZ_TO_GRAM
        silver_usd_oz = _yahoo('SI=F') or 0
        silver_g = (silver_usd_oz / gbp_per_usd) / _TROY_OZ_TO_GRAM
        data = {
            'gold_per_gram': {
                '24k': round(gold_g, 2),
                '22k': round(gold_g * 22 / 24, 2),
                '18k': round(gold_g * 18 / 24, 2),
                '9k':  round(gold_g * 9  / 24, 2),
            },
            'silver_per_gram': round(silver_g, 2),
            'currency': 'GBP',
            'source': 'live',
        }
    else:
        data = {
            'gold_per_gram': {'24k': 77.50, '22k': 71.04, '18k': 58.13, '9k': 29.06},
            'silver_per_gram': 0.84,
            'currency': 'GBP',
            'source': 'fallback',
        }

    _cache = (now, data)
    return data


MAKING_CHARGE = 100.00  # £ flat making charge
VAT_RATE = 0.20         # 20% UK VAT


def _apply_charges(metal_value: float) -> float:
    """Apply making charge and VAT: (metal_value + making_charge) × (1 + VAT)."""
    return round((metal_value + MAKING_CHARGE) * (1 + VAT_RATE), 2)


def live_price_for_product(metal_type: str, purity: str, weight_grams) -> float | None:
    """Calculate live price: (weight × spot_price_per_gram + £100 making) + 20% VAT."""
    if not weight_grams:
        return None

    prices = get_prices()
    weight = float(weight_grams)

    if metal_type == 'gold':
        match = re.search(r'(\d+)', str(purity))
        if not match:
            return None
        karat = int(match.group(1))
        gold_24k = prices['gold_per_gram']['24k']
        if karat not in (9, 18, 22, 24):
            price_per_gram = gold_24k * karat / 24
        else:
            key = f'{karat}k'
            price_per_gram = prices['gold_per_gram'].get(key, gold_24k * karat / 24)
        return _apply_charges(price_per_gram * weight)

    if metal_type == 'silver':
        return _apply_charges(prices['silver_per_gram'] * weight)

    return None
