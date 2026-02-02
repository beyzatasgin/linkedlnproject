from __future__ import annotations

from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth import views as auth_views
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse

from .forms import ProfileForm, RegisterForm
from .models import Profile


def register_view(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            Profile.objects.get_or_create(user=user)
            login(request, user)
            messages.success(request, "Hoş geldiniz!")
            return redirect("feed")
    else:
        form = RegisterForm()
    return render(request, "users/register.html", {"form": form})


@login_required
def profile_view(request, username: str | None = None):
    if username:
        profile = get_object_or_404(Profile, user__username=username)
        is_owner = profile.user == request.user
    else:
        profile, _ = Profile.objects.get_or_create(user=request.user)
        is_owner = True
    return render(request, "users/profile.html", {"profile": profile, "is_owner": is_owner})


@login_required
def profile_edit_view(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    if request.method == "POST":
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, "Profil güncellendi")
            return redirect("profile")
    else:
        form = ProfileForm(instance=profile)
    return render(request, "users/profile_edit.html", {"form": form})


class LoginViewWithRemember(auth_views.LoginView):
    template_name = "users/login.html"
    redirect_authenticated_user = True

    def form_valid(self, form):
        remember = self.request.POST.get("remember_me")
        if remember:
            # 14 gün hatırla
            self.request.session.set_expiry(60 * 60 * 24 * 14)
        else:
            # Tarayıcı kapanınca sonlanır
            self.request.session.set_expiry(0)
        return super().form_valid(form)

    def get_success_url(self):
        # next parametresini kontrol et
        next_url = self.request.GET.get("next") or self.request.POST.get("next")
        if next_url:
            return next_url
        return super().get_success_url()


def logout_view(request):
    logout(request)
    messages.success(request, "Başarıyla çıkış yaptınız.")
    return redirect("login")


