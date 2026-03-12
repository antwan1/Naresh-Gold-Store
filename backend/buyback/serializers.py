from rest_framework import serializers
from .models import GoldBuyback


class GoldBuybackSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoldBuyback
        fields = ['id', 'name', 'email', 'phone', 'item_type', 'purity',
                  'estimated_weight', 'description', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']
