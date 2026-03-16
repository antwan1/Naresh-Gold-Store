import django_filters
from .models import Product
from core.gold_price import live_price_for_product


def _effective_price(product):
    """Return live_price if calculable, else static price, else None."""
    lp = live_price_for_product(
        product.metal_type, product.purity,
        product.weight_grams, product.making_charge,
    )
    if lp is not None:
        return lp
    return float(product.price) if product.price else None


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug', lookup_expr='iexact')
    metal_type = django_filters.CharFilter(field_name='metal_type', lookup_expr='iexact')
    price_min = django_filters.NumberFilter(method='filter_price_min')
    price_max = django_filters.NumberFilter(method='filter_price_max')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')

    class Meta:
        model = Product
        fields = ['category', 'metal_type', 'price_min', 'price_max', 'is_featured']

    def filter_price_min(self, queryset, name, value):
        ids = [p.pk for p in queryset if (_effective_price(p) or 0) >= value]
        return queryset.filter(pk__in=ids)

    def filter_price_max(self, queryset, name, value):
        ids = [p.pk for p in queryset if (_effective_price(p) is not None and _effective_price(p) <= value)]
        return queryset.filter(pk__in=ids)
