from rest_framework import serializers
from products.serializers import ProductListSerializer
from .models import Cart, CartItem, Order, OrderItem


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'line_total']

    def get_line_total(self, obj):
        return str(obj.line_total) if obj.line_total else None


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total', 'item_count']

    def get_total(self, obj):
        return str(obj.total)

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_slug = serializers.CharField(source='product.slug', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_slug', 'quantity', 'unit_price', 'total_price']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'total_amount', 'payment_method',
            'contact_phone', 'recipient_name', 'shipping_cost',
            'shipping_address_line1', 'shipping_address_line2',
            'shipping_city', 'shipping_postcode', 'shipping_country',
            'notes', 'items', 'created_at',
        ]
        read_only_fields = ['id', 'status', 'total_amount', 'items', 'created_at']


class PlaceOrderSerializer(serializers.Serializer):
    payment_method = serializers.ChoiceField(choices=['stripe', 'paypal', 'cash'])
    contact_phone = serializers.CharField(required=False, allow_blank=True)
    recipient_name = serializers.CharField(required=False, allow_blank=True)
    shipping_cost = serializers.DecimalField(max_digits=6, decimal_places=2, required=False, default=0)
    shipping_address_line1 = serializers.CharField(required=False, allow_blank=True)
    shipping_address_line2 = serializers.CharField(required=False, allow_blank=True)
    shipping_city = serializers.CharField(required=False, allow_blank=True)
    shipping_postcode = serializers.CharField(required=False, allow_blank=True)
    shipping_country = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        if data.get('payment_method') != 'cash':
            required_shipping = ['shipping_address_line1', 'shipping_city', 'shipping_country']
            errors = {}
            for field in required_shipping:
                if not data.get(field, '').strip():
                    errors[field] = 'This field is required for online payment.'
            if errors:
                raise serializers.ValidationError(errors)
        return data
