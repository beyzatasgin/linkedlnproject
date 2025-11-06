from __future__ import annotations

from django.urls import path

from . import views


urlpatterns = [
    path("", views.connections_list_view, name="connections_list"),
    path("send/<str:username>/", views.send_request_view, name="connection_send"),
    path("accept/<str:username>/", views.accept_request_view, name="connection_accept"),
    path("reject/<str:username>/", views.reject_request_view, name="connection_reject"),
    path("cancel/<str:username>/", views.cancel_request_view, name="connection_cancel"),
]


