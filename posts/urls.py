from __future__ import annotations

from django.urls import path

from . import views


urlpatterns = [
    path("create/", views.post_create_view, name="post_create"),
    path("<int:post_id>/delete/", views.post_delete_view, name="post_delete"),
    path("<int:post_id>/like/", views.like_toggle_view, name="post_like_toggle"),
]


