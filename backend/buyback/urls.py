from django.urls import path
from .views import GoldBuybackCreateView

urlpatterns = [
    path('buyback/', GoldBuybackCreateView.as_view()),
]
