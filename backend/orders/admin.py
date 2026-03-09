from django.contrib import admin
from .models import Cart, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'unit_price', 'total_price']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_amount', 'payment_method', 'created_at']
    list_filter = ['status', 'payment_method']
    list_editable = ['status']
    search_fields = ['user__email', 'id']
    readonly_fields = ['created_at', 'updated_at', 'total_amount']
    inlines = [OrderItemInline]


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'item_count', 'updated_at']

    def item_count(self, obj):
        return obj.items.count()
