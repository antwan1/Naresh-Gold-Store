from django.contrib import admin
from .models import Appointment


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'date', 'time_slot', 'purpose', 'status', 'created_at']
    list_filter = ['status', 'purpose', 'date']
    search_fields = ['name', 'email']
    list_editable = ['status']
    readonly_fields = ['created_at']
