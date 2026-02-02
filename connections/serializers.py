from __future__ import annotations

from rest_framework import serializers
from .models import Connection


class ConnectionSerializer(serializers.ModelSerializer):
    from_user_username = serializers.CharField(source="from_user.username", read_only=True)
    to_user_username = serializers.CharField(source="to_user.username", read_only=True)
    from_user_id = serializers.IntegerField(source="from_user.id", read_only=True)
    to_user_id = serializers.IntegerField(source="to_user.id", read_only=True)

    class Meta:
        model = Connection
        fields = ("id", "from_user", "from_user_id", "from_user_username", "to_user", "to_user_id", "to_user_username", "status", "created_at")
        read_only_fields = ("id", "created_at", "from_user")

    def create(self, validated_data):
        validated_data["from_user"] = self.context["request"].user
        return super().create(validated_data)

