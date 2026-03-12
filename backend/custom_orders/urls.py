from django.urls import path
from .views import CustomOrderEnquiryCreateView

urlpatterns = [
    path('custom-orders/', CustomOrderEnquiryCreateView.as_view()),
]
