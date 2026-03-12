from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import WishlistItem
from .serializers import WishlistItemSerializer


class WishlistView(generics.ListCreateAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return WishlistItem.objects.filter(customer=self.request.user).select_related('product')


class WishlistItemDetailView(generics.DestroyAPIView):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return WishlistItem.objects.filter(customer=self.request.user)


class WishlistToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, product_id):
        item, created = WishlistItem.objects.get_or_create(
            customer=request.user, product_id=product_id
        )
        if not created:
            item.delete()
            return Response({'wishlisted': False})
        return Response({'wishlisted': True}, status=status.HTTP_201_CREATED)

    def get(self, request, product_id):
        wishlisted = WishlistItem.objects.filter(
            customer=request.user, product_id=product_id
        ).exists()
        return Response({'wishlisted': wishlisted})
