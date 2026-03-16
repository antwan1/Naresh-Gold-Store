import time
import urllib.request
import json
import logging

from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger(__name__)

_gold_cache: tuple[float, dict] | None = None
_CACHE_TTL = 900  # 15 minutes
_TROY_OZ_TO_GRAM = 31.1035

_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
}


def _yahoo_price(symbol: str) -> float | None:
    url = f'https://query2.finance.yahoo.com/v8/finance/chart/{symbol}?interval=1d&range=1d'
    try:
        req = urllib.request.Request(url, headers=_HEADERS)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        return float(data['chart']['result'][0]['meta']['regularMarketPrice'])
    except Exception as e:
        logger.warning('Yahoo Finance %s failed: %s', symbol, e)
        return None


def _fetch_spot_prices():
    gold_usd_oz = _yahoo_price('GC=F')   # Gold futures USD/oz
    gbp_per_usd = _yahoo_price('GBPUSD=X')  # GBP/USD rate

    if not gold_usd_oz or not gbp_per_usd:
        return None

    gold_gbp_g = (gold_usd_oz / gbp_per_usd) / _TROY_OZ_TO_GRAM

    silver_usd_oz = _yahoo_price('SI=F') or 0
    silver_gbp_g = (silver_usd_oz / gbp_per_usd) / _TROY_OZ_TO_GRAM

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
        data = {
            'gold_per_gram': {'24k': 77.50, '22k': 71.04, '18k': 58.13},
            'silver_per_gram': 0.84,
            'currency': 'GBP',
            'source': 'fallback',
        }

    _gold_cache = (now, data)
    return Response(data)
