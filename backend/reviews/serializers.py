from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'product', 'customer', 'customer_name', 'rating', 'title',
            'text', 'is_verified_purchase', 'is_approved', 'admin_reply', 'created_at',
        ]
        read_only_fields = [
            'customer', 'is_verified_purchase', 'is_approved', 'admin_reply', 'created_at',
        ]

    def get_customer_name(self, obj):
        name = obj.customer.get_full_name()
        return name if name else obj.customer.email.split('@')[0]

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError('Rating must be between 1 and 5.')
        return value

    def create(self, validated_data):
        request = self.context['request']
        if Review.objects.filter(product=validated_data['product'], customer=request.user).exists():
            raise serializers.ValidationError('You have already reviewed this product.')
        from orders.models import Order
        is_verified = Order.objects.filter(
            user=request.user,
            items__product=validated_data['product'],
            status__in=['confirmed', 'shipped', 'delivered'],
        ).exists()
        validated_data['customer'] = request.user
        validated_data['is_verified_purchase'] = is_verified
        return super().create(validated_data)
