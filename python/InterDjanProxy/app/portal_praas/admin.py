from django.contrib import admin
from .models import MenuItem, PortalItem, PortalMessage

@admin.decorators.register(MenuItem)
class menuItemAdmin(admin.ModelAdmin):
    pass


@admin.decorators.register(PortalItem)
class portalItemAdmin(admin.ModelAdmin):
    pass


@admin.decorators.register(PortalMessage)
class portalMessageAdmin(admin.ModelAdmin):
    pass
