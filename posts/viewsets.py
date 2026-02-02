from __future__ import annotations

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Post, Like
from .serializers import PostSerializer, LikeSerializer


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.select_related("author").prefetch_related("likes").all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Kullanıcının kendi postları ve bağlantılarının postları
        user = self.request.user
        connections = user.sent_connections.filter(status="ACCEPTED").values_list("to_user_id", flat=True)
        connections |= user.received_connections.filter(status="ACCEPTED").values_list("from_user_id", flat=True)
        queryset = queryset.filter(Q(author=user) | Q(author_id__in=connections))
        return queryset.order_by("-created_at")

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["post"])
    def like(self, request, pk=None):
        post = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        if not created:
            like.delete()
            return Response({"liked": False, "message": "Beğeni kaldırıldı"})
        return Response({"liked": True, "message": "Beğenildi"})


class LikeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Like.objects.select_related("user", "post").all()
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        post_id = self.request.query_params.get("post")
        if post_id:
            queryset = queryset.filter(post_id=post_id)
        return queryset

