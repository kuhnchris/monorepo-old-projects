from django.db import models

# Create your models here.

class AllowedDomain(models.Model):
    domain = models.CharField(max_length=100)
    allow = models.BooleanField(default=True)
    https = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.domain} - Allowed: {self.allow}'


class AttemptedDomainCall(models.Model):
    domain = models.CharField( max_length=100 )
    path = models.CharField( max_length=100 )

    def __str__(self):
        return f'Requested DOMAIN: {self.domain} - PATH: {self.path}'
