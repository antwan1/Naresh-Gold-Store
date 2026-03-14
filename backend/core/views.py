import time
import urllib.request
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Simple in-memory cache: (timestamp, data)
_gold_cache: tuple[float, dict] | None = None
_CACHE_TTL = 900  # 15 minutes

# Fallback GBP/USD rate if FX API is unreachable
_FALLBACK_GBP_RATE = 0.77


def _fetch_gbp_rate() -> float:
    """Fetch live USD→GBP rate from frankfurter.app (free, no API key)."""
    try:
        url = 'https://api.frankfurter.app/latest?from=USD&to=GBP'
        with urllib.request.urlopen(url, timeout=5) as resp:
            data = json.loads(resp.read())
        return float(data['rates']['GBP'])
    except Exception:
        return _FALLBACK_GBP_RATE


def _fetch_spot_prices():
    url = 'https://api.metals.live/v1/spot/gold,silver'
    try:
        with urllib.request.urlopen(url, timeout=5) as resp:
            data = json.loads(resp.read())
        # data is a list: [{'gold': price_usd}, {'silver': price_usd}]
        prices = {}
        for item in data:
            prices.update(item)
        gold_usd = float(prices.get('gold', 0))
        silver_usd = float(prices.get('silver', 0))
        if gold_usd == 0:
            return None
        gbp_rate = _fetch_gbp_rate()
        gold_gbp = gold_usd * gbp_rate / 31.1035  # troy oz -> grams
        silver_gbp = silver_usd * gbp_rate / 31.1035
        return {
            'gold_per_gram': {
                '24k': round(gold_gbp, 2),
                '22k': round(gold_gbp * 22 / 24, 2),
                '18k': round(gold_gbp * 18 / 24, 2),
            },
            'silver_per_gram': round(silver_gbp, 2),
            'currency': 'GBP',
            'source': 'live',
        }
    except Exception:
        return None


@api_view(['GET'])
def gold_prices(request):
    global _gold_cache
    now = time.time()
    if _gold_cache and (now - _gold_cache[0]) < _CACHE_TTL:
        return Response(_gold_cache[1])
    data = _fetch_spot_prices()
    if data is None:
        # Fallback prices based on current market (March 2026 ~£77/g for 24k)
        data = {
            'gold_per_gram': {'24k': 77.50, '22k': 71.04, '18k': 58.13},
            'silver_per_gram': 0.84,
            'currency': 'GBP',
            'source': 'fallback',
        }
    _gold_cache = (now, data)
    return Response(data)
