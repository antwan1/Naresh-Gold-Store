from rest_framework import serializers
from .models import Enquiry


class EnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Enquiry
        fields = ['id', 'name', 'email', 'phone', 'message', 'product', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']
