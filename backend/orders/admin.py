import csv
from django.contrib import admin
from django.http import HttpResponse
from .models import Cart, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'quantity', 'unit_price', 'total_price']


def export_orders_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="orders.csv"'
    writer = csv.writer(response)
    writer.writerow(['Order ID', 'Customer', 'Email', 'Status', 'Payment', 'Total', 'Commission', 'Date'])
    for order in queryset.select_related('user'):
        writer.writerow([
            order.id, f"{order.user.first_name} {order.user.last_name}".strip() or order.user.email,
            order.user.email, order.status, order.payment_method,
            order.total_amount, order.commission_amount, order.created_at.strftime('%Y-%m-%d %H:%M'),
        ])
    return response
export_orders_csv.short_description = 'Export selected orders as CSV'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'tracking_number', 'total_amount', 'payment_method', 'created_at']
    list_filter = ['status', 'payment_method']
    list_editable = ['status', 'tracking_number']
    search_fields = ['user__email', 'id', 'tracking_number']
    readonly_fields = ['created_at', 'updated_at', 'total_amount', 'commission_rate', 'commission_amount']
    inlines = [OrderItemInline]
    actions = [export_orders_csv]


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['user', 'item_count', 'updated_at']

    def item_count(self, obj):
        return obj.items.count()
