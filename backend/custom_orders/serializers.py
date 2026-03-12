from rest_framework import serializers
from .models import CustomOrderEnquiry


class CustomOrderEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomOrderEnquiry
        fields = ['name', 'email', 'phone', 'piece_type', 'metal', 'budget', 'description', 'occasion']
