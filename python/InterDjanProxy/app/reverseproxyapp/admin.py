from django.contrib import admin
from .models import AllowedDomain, AttemptedDomainCall


@admin.decorators.register(AllowedDomain)
class AllowedDomainAdmin(admin.ModelAdmin):
    pass


@admin.decorators.register(AttemptedDomainCall)
class AttemptedDomainAdmin(admin.ModelAdmin):
    actions = [ 'allow' ]
    def allow(self,request, queryset):
        for domain in queryset:
            AllowedDomain.objects.create(domain=domain.domain,allow=True).save()
            domain.delete()


