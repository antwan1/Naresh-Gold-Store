import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug', lookup_expr='iexact')
    metal_type = django_filters.CharFilter(field_name='metal_type', lookup_expr='iexact')
    price_min = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')

    class Meta:
        model = Product
        fields = ['category', 'metal_type', 'price_min', 'price_max', 'is_featured']
