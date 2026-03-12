from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('product', 'customer', 'rating', 'is_verified_purchase', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'is_verified_purchase', 'rating')
    search_fields = ('customer__email', 'product__name', 'title')
    list_editable = ('is_approved',)
    readonly_fields = ('created_at', 'is_verified_purchase')
    fieldsets = (
        (None, {'fields': ('product', 'customer', 'rating', 'title', 'text')}),
        ('Status', {'fields': ('is_verified_purchase', 'is_approved', 'admin_reply', 'created_at')}),
    )
