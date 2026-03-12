from django.contrib import admin
from .models import WishlistItem


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ('customer', 'product', 'created_at')
    list_filter = ('product__category',)
    search_fields = ('customer__email', 'product__name')
    readonly_fields = ('created_at',)
