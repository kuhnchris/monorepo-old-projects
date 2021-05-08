from dal import autocomplete
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from rest_framework import viewsets

from .forms import InvoiceForm, InvoiceLineForm
from .models import *
from .models import (InvoiceHead, Ledger, LedgerClosingTypes, LedgerTypes,
                     Vendor)


def index(request):
    return HttpResponseRedirect("/invoices")


def templateViewReturn(request, templateUrl, templateContext):
    ledgers = Ledger.objects.order_by('id')
    context = templateContext
    context['ledgers'] = ledgers
    return render(request, templateUrl, context)


def invoiceNew(request):
    selectedInvoice_balance = 0
    return templateViewReturn(request,
                              'finance/invoiceDetail.html',
                              {'editmode': True
                              })


def invoiceView(request, invoice_id):
    selectedInvoice = InvoiceHead.objects.get(pk=invoice_id)
    selectedInvoice_balance = 0
    for itm in selectedInvoice.positions.all():
        selectedInvoice_balance = selectedInvoice_balance + itm.per_amount_price
    return templateViewReturn(request,
                              'finance/invoiceDetail.html',
                              {'selectedInvoice':selectedInvoice,
                               'selectedInvoice_balance':selectedInvoice_balance
                              })


def invoiceOverview(request):
    invoices = InvoiceHead.objects.order_by('id')
    return templateViewReturn(request,
                              'finance/invoiceOverview.html',
                              {'invoices': invoices})


def ledgerView(request, ledger_id):
    selectedLedger = Ledger.objects.get(pk=ledger_id)
    selectedLedger_balance = 0
    selectedLedger_ledgerType = LedgerTypes.__dict__[selectedLedger.ledger_type].value
    for itm in selectedLedger.invoiceItems.all():
        selectedLedger_balance = selectedLedger_balance + itm.per_amount_price


    if not selectedLedger:
        return Http404.message('Invalid ledger ID')
    return templateViewReturn(request,
                              'finance/ledgerOverview.html',
                              {'selectedLedger': selectedLedger,
                               'selectedLedger_balance': selectedLedger_balance,
                               'selectedLedger_ledgerType': selectedLedger_ledgerType
                               })

def renderInvHeaderAddView(request):
    invLines = []
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        form = InvoiceForm(request.POST)
        # check whether it's valid:
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/invoices/')

    else:
        # form = InvoiceHeadForm()
        form = InvoiceForm()
        invLines = [InvoiceLineForm()]
    return render(request, 'finance/forms/newInvoiceHeadForm.html', {'form': form, 'invLines': invLines})




class SupportedLanguageViewSet(viewsets.ModelViewSet):
    queryset = SupportedLanguage.objects.all()
    serializer_class = SupportedLanguageSerializer
class CurrencyViewSet(viewsets.ModelViewSet):
    queryset = Currency.objects.all()
    serializer_class = CurrencySerializer
class LedgerViewSet(viewsets.ModelViewSet):
    queryset = Ledger.objects.all()
    serializer_class = LedgerSerializer
class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
class InvoiceHeadViewSet(viewsets.ModelViewSet):
    queryset = InvoiceHead.objects.all()
    serializer_class = InvoiceHeadSerializer
class MaterialGroupViewSet(viewsets.ModelViewSet):
    queryset = MaterialGroup.objects.all()
    serializer_class = MaterialGroupSerializer
class MaterialTextViewSet(viewsets.ModelViewSet):
    queryset = MaterialText.objects.all()
    serializer_class = MaterialTextSerializer
class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
class UOMViewSet(viewsets.ModelViewSet):
    queryset = UOM.objects.all()
    serializer_class = UOMSerializer
class InvoicePositionViewSet(viewsets.ModelViewSet):
    queryset = InvoicePosition.objects.all()
    serializer_class = InvoicePositionSerializer
