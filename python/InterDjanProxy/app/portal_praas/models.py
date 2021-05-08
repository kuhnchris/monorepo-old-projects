from django.db import models
from django.contrib.auth.models import Group


class MenuItem(models.Model):
    description = models.CharField(max_length=100)
    href = models.CharField(max_length=255)
    sortOrder = models.IntegerField(default=0)
    requiresLogin = models.BooleanField(default=True)
    onlyDisplayIfLoggedOut = models.BooleanField(default=False)
    requiredPermissions = models.ForeignKey(blank=True, null=True, to=Group, on_delete=models.deletion.DO_NOTHING)

    def __str__(self):
        return f'{self.description} ({self.href}), displayed for: OnlyLoggedOut? {self.onlyDisplayIfLoggedOut} - LoggedIn? {self.requiresLogin} - Permission {self.requiredPermissions}'


class PortalItem(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255, blank=True, default="")
    note = models.CharField(max_length=255, blank=True, default="")
    href = models.CharField(max_length=255)
    sortOrder = models.IntegerField(default=0)
    requiresLogin = models.BooleanField(default=True)
    onlyDisplayIfLoggedOut = models.BooleanField(default=False)
    requiredPermissions = models.ForeignKey(blank=True, null=True, to=Group, on_delete=models.deletion.DO_NOTHING)

    def __str__(self):
        return f'{self.title} ({self.href}), displayed for: OnlyLoggedOut? {self.onlyDisplayIfLoggedOut} - LoggedIn? {self.requiresLogin} - Permission {self.requiredPermissions}'


class PortalMessage(models.Model):
    text = models.TextField(default="")
    active = models.BooleanField(default=True)
    sortOrder = models.IntegerField(default=0)

    def __str__(self):
        if self.active:
            return f'{self.text}'
        else:
            return f'inactive: {self.text}'
