from rest_framework import generics, permissions
from .models import Review
from .serializers import ReviewSerializer


class ProductReviewListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    authentication_classes = []
    pagination_class = None
    permission_classes = []

    def get_queryset(self):
        return Review.objects.filter(
            product_id=self.kwargs['product_id'], is_approved=True
        )


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
