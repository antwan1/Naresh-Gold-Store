import time
import urllib.request
import urllib.error
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Simple in-memory cache: (timestamp, data)
_gold_cache: tuple[float, dict] | None = None
_CACHE_TTL = 900  # 15 minutes

_TROY_OZ_TO_GRAM = 31.1035


def _fetch_yahoo_xau_gbp() -> float | None:
    """Fetch live XAU/GBP (gold price in GBP per troy oz) from Yahoo Finance."""
    url = 'https://query1.finance.yahoo.com/v8/finance/chart/XAUGBP=X?interval=1d&range=1d'
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read())
        price = data['chart']['result'][0]['meta']['regularMarketPrice']
        return float(price)
    except Exception:
        return None


def _fetch_silver_gbp() -> float | None:
    """Fetch live XAG/GBP (silver price in GBP per troy oz) from Yahoo Finance."""
    url = 'https://query1.finance.yahoo.com/v8/finance/chart/XAGGBP=X?interval=1d&range=1d'
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read())
        price = data['chart']['result'][0]['meta']['regularMarketPrice']
        return float(price)
    except Exception:
        return None


def _fetch_spot_prices():
    gold_gbp_oz = _fetch_yahoo_xau_gbp()
    if gold_gbp_oz is None:
        return None

    silver_gbp_oz = _fetch_silver_gbp() or 0
    gold_gbp_g = gold_gbp_oz / _TROY_OZ_TO_GRAM
    silver_gbp_g = silver_gbp_oz / _TROY_OZ_TO_GRAM

    return {
        'gold_per_gram': {
            '24k': round(gold_gbp_g, 2),
            '22k': round(gold_gbp_g * 22 / 24, 2),
            '18k': round(gold_gbp_g * 18 / 24, 2),
        },
        'silver_per_gram': round(silver_gbp_g, 2),
        'currency': 'GBP',
        'source': 'live',
    }


@api_view(['GET'])
def gold_prices(request):
    global _gold_cache
    now = time.time()
    if _gold_cache and (now - _gold_cache[0]) < _CACHE_TTL:
        return Response(_gold_cache[1])

    data = _fetch_spot_prices()
    if data is None:
        # Fallback prices (update periodically if API goes down)
        data = {
            'gold_per_gram': {'24k': 77.50, '22k': 71.04, '18k': 58.13},
            'silver_per_gram': 0.84,
            'currency': 'GBP',
            'source': 'fallback',
        }

    _gold_cache = (now, data)
    return Response(data)
