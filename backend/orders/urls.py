from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('cart/', CartViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('cart/<int:pk>/', CartViewSet.as_view({'put': 'update', 'delete': 'destroy'})),
]
