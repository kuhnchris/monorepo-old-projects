from django.views.generic import TemplateView
from django.contrib.auth.views import LoginView, LogoutView
from .models import MenuItem, PortalItem, PortalMessage


class PraaSContextExpanderMixin:
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["menuitems"] = []
        context["messages"] = []
        context["items"] = []

        qry_obj = MenuItem.objects.all().order_by('sortOrder')
        if self.request.user.get_username():
            qry_obj = qry_obj.filter(onlyDisplayIfLoggedOut=False)
        else:
            qry_obj = qry_obj.filter(requiresLogin=False)

        for obj in qry_obj:
            context["menuitems"].append({"href": obj.href, "description": obj.description})

        qry_obj = PortalItem.objects.all().order_by('sortOrder')
        if self.request.user.get_username():
            qry_obj = qry_obj.filter(onlyDisplayIfLoggedOut=False)
        else:
            qry_obj = qry_obj.filter(requiresLogin=False)

        for obj in qry_obj:
            context['items'].append(
                {"title": obj.title, "description": obj.description, "note": obj.note, "href": obj.href})

        qry_obj = PortalMessage.objects.all().order_by('sortOrder')
        for obj in qry_obj:
            context['messages'].append({"text": obj.text})

        return context


class PraaSPortalLogoutView(PraaSContextExpanderMixin, LogoutView):
    template_name = 'registration/logoff.html'

class PraaSPortalLoginView(PraaSContextExpanderMixin, LoginView):
    pass

class PraaSPortalView(PraaSContextExpanderMixin, TemplateView):
    template_name = 'praas/overview.html'
