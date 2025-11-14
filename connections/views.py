from __future__ import annotations

from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, redirect, render

from .models import Connection


@login_required
def connections_list_view(request):
    sent = Connection.objects.filter(from_user=request.user, status=Connection.Status.PENDING)
    received = Connection.objects.filter(to_user=request.user, status=Connection.Status.PENDING)
    accepted_from = Connection.objects.filter(from_user=request.user, status=Connection.Status.ACCEPTED)
    accepted_to = Connection.objects.filter(to_user=request.user, status=Connection.Status.ACCEPTED)
    return render(
        request,
        "connections/list.html",
        {"sent": sent, "received": received, "accepted_from": accepted_from, "accepted_to": accepted_to},
    )


@login_required
def send_request_view(request, username: str):
    to_user = get_object_or_404(User, username=username)
    if to_user == request.user:
        return redirect("connections_list")
    Connection.objects.get_or_create(from_user=request.user, to_user=to_user)
    messages.success(request, "Bağlantı isteği gönderildi")
    return redirect("connections_list")


@login_required
def accept_request_view(request, username: str):
    from_user = get_object_or_404(User, username=username)
    conn = get_object_or_404(Connection, from_user=from_user, to_user=request.user)
    conn.status = Connection.Status.ACCEPTED
    conn.save(update_fields=["status"])
    messages.success(request, "Bağlantı isteği kabul edildi")
    return redirect("connections_list")


