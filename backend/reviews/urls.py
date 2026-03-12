from django.urls import path
from .views import ProductReviewListView, ReviewCreateView

urlpatterns = [
    path('reviews/<int:product_id>/', ProductReviewListView.as_view()),
    path('reviews/', ReviewCreateView.as_view()),
]
