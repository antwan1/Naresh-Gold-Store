from rest_framework.decorators import api_view
from rest_framework.response import Response
from .gold_price import get_prices


@api_view(['GET'])
def gold_prices(request):
    return Response(get_prices())
