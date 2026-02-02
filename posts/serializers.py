from __future__ import annotations

from rest_framework import serializers
from .models import Post, Like


class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_id = serializers.IntegerField(source="author.id", read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ("id", "author", "author_id", "author_username", "content", "created_at", "updated_at", "likes_count", "is_liked")
        read_only_fields = ("id", "created_at", "updated_at", "author")

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return Like.objects.filter(user=request.user, post=obj).exists()
        return False

    def create(self, validated_data):
        validated_data["author"] = self.context["request"].user
        return super().create(validated_data)


class LikeSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Like
        fields = ("id", "user", "user_username", "post", "created_at")
        read_only_fields = ("id", "created_at")

