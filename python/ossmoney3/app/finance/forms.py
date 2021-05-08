from dal import autocomplete
from .models import Vendor, InvoicePosition, InvoiceHead
from django import forms


class InvoiceLineForm(forms.ModelForm):
    class Meta:
        model = InvoicePosition
        exclude = [ ]


class InvoiceForm(forms.ModelForm):

    class Meta:
        model = InvoiceHead
        exclude = []
#        widgets = {
#            'vendor': forms.TextInput()
#        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        for field_name in self.fields:
            self.fields[field_name].required = False

        self.fields['notes'].widget.attrs.update({'cols': '100%', 'rows': '2'})
        self.fields['ocrText'].widget.attrs.update({'cols': '100%', 'rows': '2'})

    def clean(self):
        pass

    def save(self, commit=True):
        super().save(self)
        head = self.instance
        head.vendor = self.cleaned_data["vendor"]

        head.positions.all().delete()
