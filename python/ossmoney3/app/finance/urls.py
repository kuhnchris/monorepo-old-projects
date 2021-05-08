from django.urls import path, include

from . import views
#from .views import VendorAutoComplete


from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'supportedlanguage',views.SupportedLanguageViewSet)
router.register(r'currency',views.CurrencyViewSet)
router.register(r'ledger',views.LedgerViewSet)
router.register(r'vendor',views.VendorViewSet)
router.register(r'invoicehead',views.InvoiceHeadViewSet)
router.register(r'materialgroup',views.MaterialGroupViewSet)
router.register(r'materialtext',views.MaterialTextViewSet)
router.register(r'material',views.MaterialViewSet)
router.register(r'uom',views.UOMViewSet)
router.register(r'invoiceposition',views.InvoicePositionViewSet)

urlpatterns = [
    path('', views.index, name='index'),
    path('ledger/<int:ledger_id>/', views.ledgerView, name='ledger'),
    path('invoice/<int:invoice_id>/', views.invoiceView, name='invoice'),
    path('invoices/', views.invoiceOverview, name='invoiceOverview'),
    path('invoices/new', views.invoiceNew, name='invoiceNew'),
    path('invoices/add2', views.renderInvHeaderAddView, name='invoiceAdd2'),
 #   path('autocomplete/vendor', VendorAutoComplete.as_view(create_field='short_name'), name="vendor-autocomplete"),
    
    path('rest/', include(router.urls)),
    path('rest-api/', include('rest_framework.urls', namespace='rest_framework')),
]
