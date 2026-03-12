from django.urls import path
from .views import WishlistView, WishlistItemDetailView, WishlistToggleView

urlpatterns = [
    path('wishlist/', WishlistView.as_view()),
    path('wishlist/<int:pk>/', WishlistItemDetailView.as_view()),
    path('wishlist/toggle/<int:product_id>/', WishlistToggleView.as_view()),
]
