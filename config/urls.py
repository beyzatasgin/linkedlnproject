from __future__ import annotations

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from posts import views as posts_views

urlpatterns = [
    path("admin/", admin.site.urls),

    # API endpoints
    path("api/", include("users.api_urls")),
    path("api/", include("posts.api_urls")),
    path("api/", include("connections.api_urls")),

    # Ana sayfa (feed)
    path("", posts_views.feed_view, name="feed"),

    # Users
    path("", include("users.urls")),

    # Posts
    path("posts/", include("posts.urls")),

    # Connections
    path("connections/", include("connections.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
