from __future__ import annotations

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .models import Profile
from .serializers import UserSerializer, ProfileSerializer, RegisterSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response(
                    {"message": "Kullanıcı başarıyla oluşturuldu", "user_id": user.id},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response(
                    {"error": f"Kullanıcı oluşturulurken hata: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        # Hata mesajlarını daha okunabilir hale getir
        errors = {}
        for field, messages in serializer.errors.items():
            if isinstance(messages, list):
                errors[field] = messages[0] if messages else "Geçersiz değer"
            else:
                errors[field] = str(messages)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.select_related("user").all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get("username", None)
        if username:
            queryset = queryset.filter(user__username=username)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    @action(detail=False, methods=["get"])
    def me(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def by_username(self, request, pk=None):
        username = request.query_params.get("username")
        if not username:
            return Response({"error": "username parametresi gerekli"}, status=status.HTTP_400_BAD_REQUEST)
        profile = get_object_or_404(Profile, user__username=username)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

