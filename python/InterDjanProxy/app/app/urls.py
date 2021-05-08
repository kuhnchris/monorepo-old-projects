from django.conf.urls import re_path, url, include
from reverseproxyapp.views import ReverseProxyView
from portal_praas.views import PraaSPortalView, PraaSPortalLoginView, PraaSPortalLogoutView
from django.views.generic import RedirectView
from django.contrib import admin
from django.contrib.auth import urls

urlpatterns = (
    re_path(r'^proxy/(?P<domain>[^/]*)/(?P<path>.*)$', ReverseProxyView.as_view()),
    #url(r"user/", include('django.contrib.auth.urls')),
    url(r"login/$",PraaSPortalLoginView.as_view()),
    url(r"logout/$",PraaSPortalLogoutView.as_view()),
    url(r"accounts/profile/$",RedirectView.as_view(url="/portal/")),
    re_path('admin/', admin.site.urls),
    re_path(r"^$",RedirectView.as_view(url="/portal/")),
    url(r"portal/$",PraaSPortalView.as_view())
)
