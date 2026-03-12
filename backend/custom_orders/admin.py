from django.contrib import admin
from .models import CustomOrderEnquiry


@admin.register(CustomOrderEnquiry)
class CustomOrderEnquiryAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'piece_type', 'metal', 'budget', 'status', 'created_at']
    list_filter = ['status', 'piece_type', 'metal', 'budget']
    list_editable = ['status']
    search_fields = ['name', 'email', 'phone', 'description']
    readonly_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']
