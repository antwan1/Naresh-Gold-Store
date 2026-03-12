from django.urls import path
from .views import gold_prices

urlpatterns = [
    path('gold-prices/', gold_prices),
]
