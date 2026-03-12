import time
import urllib.request
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Simple in-memory cache: (timestamp, data)
_gold_cache: tuple[float, dict] | None = None
_CACHE_TTL = 900  # 15 minutes


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
        # Approximate GBP conversion (rough — no FX API needed for dev)
        GBP_RATE = 0.79
        gold_gbp = gold_usd * GBP_RATE / 31.1035  # troy oz -> grams
        silver_gbp = silver_usd * GBP_RATE / 31.1035
        return {
            'gold_per_gram': {
                '24k': round(gold_gbp, 2),
                '22k': round(gold_gbp * 22 / 24, 2),
                '18k': round(gold_gbp * 18 / 24, 2),
            },
            'silver_per_gram': round(silver_gbp, 2),
            'currency': 'GBP',
            'source': 'metals.live',
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
        # Fallback static prices if API unreachable
        data = {
            'gold_per_gram': {'24k': 61.50, '22k': 56.38, '18k': 46.13},
            'silver_per_gram': 0.77,
            'currency': 'GBP',
            'source': 'fallback',
        }
    _gold_cache = (now, data)
    return Response(data)
