from django.contrib import admin

# Register your models here.
from .models import Currency, InvoiceHead, InvoicePosition, Ledger, Vendor, MaterialGroup, MaterialText, Material

admin.site.register(Currency)
admin.site.register(InvoiceHead)
admin.site.register(InvoicePosition)
admin.site.register(Ledger)
admin.site.register(Vendor)
admin.site.register(Material)
admin.site.register(MaterialText)
admin.site.register(MaterialGroup)
