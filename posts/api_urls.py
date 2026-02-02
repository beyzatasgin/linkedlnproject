from __future__ import annotations

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .viewsets import PostViewSet, LikeViewSet

router = DefaultRouter()
router.register(r"posts", PostViewSet, basename="post")
router.register(r"likes", LikeViewSet, basename="like")

urlpatterns = [
    path("", include(router.urls)),
]

