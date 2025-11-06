from __future__ import annotations

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from posts import views as posts_views


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", posts_views.feed_view, name="feed"),
    path("", include("users.urls")),
    path("posts/", include("posts.urls")),
    path("connections/", include("connections.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)


