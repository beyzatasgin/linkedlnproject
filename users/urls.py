from __future__ import annotations

from django.urls import path
from django.contrib.auth import views as auth_views

from . import views


urlpatterns = [
    path("register/", views.register_view, name="register"),
    path("login/", views.LoginViewWithRemember.as_view(template_name="users/login.html"), name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("profile/", views.profile_view, name="profile"),
    path("profile/edit/", views.profile_edit_view, name="profile_edit"),
    path("search/", views.user_search_view, name="user_search"),
    path("u/<str:username>/", views.profile_view, name="profile_detail"),
    # Password reset
    path(
        "password-reset/",
        auth_views.PasswordResetView.as_view(template_name="users/password_reset_form.html"),
        name="password_reset",
    ),
    path(
        "password-reset/done/",
        auth_views.PasswordResetDoneView.as_view(template_name="users/password_reset_done.html"),
        name="password_reset_done",
    ),
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(template_name="users/password_reset_confirm.html"),
        name="password_reset_confirm",
    ),
    path(
        "reset/done/",
        auth_views.PasswordResetCompleteView.as_view(template_name="users/password_reset_complete.html"),
        name="password_reset_complete",
    ),
]


