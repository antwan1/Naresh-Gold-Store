from rest_framework import serializers
from .models import Category, Product, ProductImage
from core.gold_price import live_price_for_product


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'sort_order']


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'product_count']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    live_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'metal_type', 'weight_grams',
            'purity', 'price', 'live_price', 'is_price_on_request', 'sku',
            'stock_quantity', 'is_featured', 'is_active', 'images',
            'primary_image', 'created_at',
        ]

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        return None

    def get_live_price(self, obj):
        return live_price_for_product(obj.metal_type, obj.purity, obj.weight_grams, obj.making_charge)


class ProductDetailSerializer(ProductListSerializer):
    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + [
            'description', 'name_hi', 'name_pa', 'description_hi', 'description_pa', 'updated_at',
        ]
