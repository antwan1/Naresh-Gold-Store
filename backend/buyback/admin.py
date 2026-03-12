from django.contrib import admin
from .models import GoldBuyback


@admin.register(GoldBuyback)
class GoldBuybackAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'item_type', 'purity', 'estimated_weight', 'status', 'created_at']
    list_filter = ['status', 'item_type', 'purity']
    list_editable = ['status']
    search_fields = ['name', 'email', 'phone']
    readonly_fields = ['created_at']
