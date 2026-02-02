from __future__ import annotations

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import ConnectionViewSet

router = DefaultRouter()
router.register(r"connections", ConnectionViewSet, basename="connection")

urlpatterns = [
    path("", include(router.urls)),
]

