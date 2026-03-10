import datetime
from rest_framework import serializers
from .models import Appointment


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'name', 'email', 'phone', 'date', 'time_slot', 'purpose', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

    def validate_date(self, value):
        if value < datetime.date.today():
            raise serializers.ValidationError('Appointment date cannot be in the past.')
        return value
