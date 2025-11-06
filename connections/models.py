from __future__ import annotations

from django.conf import settings
from django.db import models


class Connection(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Beklemede"
        ACCEPTED = "ACCEPTED", "Kabul edildi"

    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_connections"
    )
    to_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_connections"
    )
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("from_user", "to_user")

    def __str__(self) -> str:
        return f"{self.from_user} -> {self.to_user} ({self.status})"


