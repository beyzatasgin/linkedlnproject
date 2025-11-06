from __future__ import annotations

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render

from .forms import PostForm
from .models import Like, Post


@login_required
def feed_view(request: HttpRequest) -> HttpResponse:
    form = PostForm()
    posts = Post.objects.select_related("author").all()
    return render(request, "posts/feed.html", {"form": form, "posts": posts})


@login_required
def post_create_view(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            messages.success(request, "Gönderi paylaşıldı")
    return redirect("feed")


@login_required
def post_delete_view(request: HttpRequest, post_id: int) -> HttpResponse:
    post = get_object_or_404(Post, id=post_id, author=request.user)
    post.delete()
    messages.success(request, "Gönderi silindi")
    return redirect("feed")


@login_required
def like_toggle_view(request: HttpRequest, post_id: int) -> HttpResponse:
    post = get_object_or_404(Post, id=post_id)
    like, created = Like.objects.get_or_create(user=request.user, post=post)
    if not created:
        like.delete()
    return redirect("feed")


