from __future__ import annotations

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from .models import Connection
from .serializers import ConnectionSerializer


class ConnectionViewSet(viewsets.ModelViewSet):
    queryset = Connection.objects.select_related("from_user", "to_user").all()
    serializer_class = ConnectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        # Kullanıcının gönderdiği ve aldığı bağlantılar
        queryset = queryset.filter(from_user=user) | queryset.filter(to_user=user)
        status_filter = self.request.query_params.get("status")
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset.order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        connection = self.get_object()
        if connection.to_user != request.user:
            return Response({"error": "Bu bağlantı isteğini kabul edemezsiniz"}, status=status.HTTP_403_FORBIDDEN)
        connection.status = Connection.Status.ACCEPTED
        connection.save()
        serializer = self.get_serializer(connection)
        return Response(serializer.data)

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        connection = self.get_object()
        if connection.to_user != request.user:
            return Response({"error": "Bu bağlantı isteğini reddedemezsiniz"}, status=status.HTTP_403_FORBIDDEN)
        connection.delete()
        return Response({"message": "Bağlantı isteği reddedildi"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["post"])
    def send_request(self, request):
        to_user_id = request.data.get("to_user_id")
        if not to_user_id:
            return Response({"error": "to_user_id gerekli"}, status=status.HTTP_400_BAD_REQUEST)
        
        to_user = get_object_or_404(User, id=to_user_id)
        if to_user == request.user:
            return Response({"error": "Kendinize bağlantı isteği gönderemezsiniz"}, status=status.HTTP_400_BAD_REQUEST)
        
        connection, created = Connection.objects.get_or_create(
            from_user=request.user,
            to_user=to_user,
            defaults={"status": Connection.Status.PENDING}
        )
        
        if not created:
            return Response({"error": "Bağlantı isteği zaten mevcut"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.get_serializer(connection)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

