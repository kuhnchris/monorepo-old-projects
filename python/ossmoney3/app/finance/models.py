from django.db import models
from enum import Enum
import datetime
from rest_framework import routers, serializers, viewsets

class LedgerClosingTypes(Enum):
    L = "left side"
    R = "right side"
    N = "none"


class LedgerTypes(Enum):
    OB = "opening balance" #oeffnungsbilanz
    AA = "active account" #aktivkonto
    PA = "passive account" #passivkonto
    EA = "expense account" #aufwandskonto
    IA = "income account" #ertragskonto
    CB = "closing balance" #schlussbilanz
    IS = "income statement" #erfolgsrechnung
    XX = "none"


class baseModel(models.Model):
    created_on = models.DateTimeField(auto_now=True)
    changed_on = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.changed_on = datetime.datetime.now()
        super().save(*args, **kwargs)


class SupportedLanguage(baseModel):
    short = models.CharField(primary_key=True, max_length=2)
    long = models.TextField(max_length=255)


class Currency(baseModel):
    name = models.TextField(max_length=3, primary_key=True)
    longname = models.TextField(max_length=10)

    def __str__(self):
        return self.name


class Ledger(baseModel):
    name = models.TextField()
    close_against = models.ForeignKey('self',
                                      on_delete=models.CASCADE,
                                      blank=True, null=True)
    close_side = models.CharField(
        max_length=1,
        choices=[(str(lt).split('.')[1], lt.value) for lt in LedgerClosingTypes]  # Choices is a list of Tuple
    )

    ledger_type = models.CharField(
        max_length=2,
        choices=[(str(lt).split('.')[1], lt.value) for lt in LedgerTypes]  # Choices is a list of Tuple
    )

    def __str__(self):
        return self.name


class Vendor(baseModel):
    short_name = models.TextField(max_length=128)
    name = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    contact_address = models.TextField(null=True, blank=True)

    default_ledger = models.ForeignKey(to=Ledger,
                                       on_delete=models.CASCADE,
                                       null=True)

    def __str__(self):
        return self.short_name


class InvoiceHead(baseModel):
    notes = models.TextField(primary_key=False, max_length=255, null=True, blank=True)
    vendor = models.ForeignKey(to=Vendor, on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(null=True, blank=True)
    tryOCR = models.BooleanField(blank=True, default=False)
    ocrText = models.TextField(null=True, blank=True)

    def __str__(self):
        return f'Invoice {self.pk} by {self.vendor} / Notes: {self.notes}'


class MaterialGroup(baseModel):
    groupName = models.TextField(max_length=255)

    def __str__(self):
        return f'{self.groupName} (material group)'


class MaterialText(baseModel):
    text = models.TextField()
    language = models.ForeignKey(SupportedLanguage, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.text} (material text, language: {self.language})'


class Material(baseModel):
    name = models.TextField(max_length=255)
    texts = models.ManyToManyField(MaterialText, blank=True)
    group = models.ManyToManyField(MaterialGroup, blank=True)

    def __str__(self):
        return f'{self.name} (material, groups: {self.group.count()}, texts: {self.texts.count()})'


class UOM(baseModel):
    short_name = models.TextField(max_length=5)
    long_name = models.TextField(max_length=255)

    def __str__(self):
        return f'{self.short_name} ({self.long_name})'


class InvoicePosition(baseModel):
    position = models.IntegerField(null=True, blank=True)
    per_amount_price = models.FloatField(null=True)
    per_amount_price_unit = models.FloatField(null=True)
    purchase_amount = models.FloatField(null=True)
    lineText = models.TextField(max_length=255, null=True, blank=True)

    unit_of_measure = models.ForeignKey(to=UOM,
                                        on_delete=models.CASCADE,
                                        null=True,
                                        blank=True)

    currency = models.ForeignKey(to=Currency,
                                 on_delete=models.CASCADE)

    ledger = models.ForeignKey(to=Ledger,
                               on_delete=models.CASCADE,
                               related_name="invoiceItems")

    head = models.ForeignKey(InvoiceHead,
                             on_delete=models.CASCADE,
                             related_name="positions")

    materialGroup = models.ManyToManyField(MaterialGroup,
                                           blank=True)

    material = models.ForeignKey(Material,
                                 on_delete=models.CASCADE,
                                 null=True,
                                 blank=True)

    def save(self, *args, **kwargs):
        if not self.position:
            last_pos = self.head.positions.order_by('position').last()
            if not last_pos or not last_pos.position:
                self.position = 1
            else:
                self.position = last_pos.position + 1
        super().save(*args, **kwargs)

    def __str__(self):
        ret_str = f'Invoice {self.head.pk}:{self.position} ({self.pk}) '
        ret_str = ret_str + f'({self.head.vendor}): '
        ret_str = ret_str + f'{self.per_amount_price} {self.currency.name}'
        return ret_str



from rest_framework import serializers

class baseModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = baseModel
        fields = '__all__';
class SupportedLanguageSerializer(serializers.ModelSerializer ):
    class Meta:
        model = SupportedLanguage
        fields = '__all__';
class CurrencySerializer(serializers.ModelSerializer ):
    class Meta:
        model = Currency
        fields = ('name','longname')
class LedgerSerializer(serializers.ModelSerializer ):
    class Meta:
        model = Ledger
        fields = '__all__';
class VendorSerializer(serializers.ModelSerializer ):
    class Meta:
        model = Vendor
        fields = '__all__';
class InvoiceHeadSerializer(serializers.ModelSerializer ):
    class Meta:
        model = InvoiceHead
        fields = '__all__';
class MaterialGroupSerializer(serializers.ModelSerializer ):
    class Meta:
        model = MaterialGroup
        fields = '__all__';
class MaterialTextSerializer(serializers.ModelSerializer ):
    class Meta:
        model = MaterialText
        fields = '__all__';
class MaterialSerializer(serializers.ModelSerializer ):
    class Meta:
        model = Material
        fields = '__all__';
class UOMSerializer(serializers.ModelSerializer ):
    class Meta:
        model = UOM
        fields = '__all__';
class InvoicePositionSerializer(serializers.ModelSerializer ):
    class Meta:
        model = InvoicePosition
        fields = '__all__';
        
