from rest_framework import serializers
from .models import WishlistItem
from products.serializers import ProductListSerializer as ProductSerializer


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_id', 'created_at']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        item, _ = WishlistItem.objects.get_or_create(**validated_data)
        return item
