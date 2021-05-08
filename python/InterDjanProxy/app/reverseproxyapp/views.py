from revproxy.views import ProxyView
from .models import AllowedDomain, AttemptedDomainCall
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.shortcuts import Http404
import re


class ReverseProxyView(ProxyView):
    upstream = 'https://orf.at'
    baseUrl = '/proxy/'

    @method_decorator(login_required(login_url='/user/login/'))
    def dispatch(self, request, domain, path):
        print(f'requesting: {domain}/{path}... (request: {request})')
        entry = AllowedDomain.objects.filter(domain=domain, allow=True)
        if entry.count() < 1:
            print(f'not allowed: {domain}')
            if AttemptedDomainCall.objects.filter(domain=domain).count() < 1:
                AttemptedDomainCall.objects.create(domain=domain, path=path).save()
            raise Http404('Not allowed.')

        if entry.filter(https=True).count() > 0:
            self.upstream = f'https://{domain}'
        else:
            self.upstream = f'http://{domain}'

        x = super(ReverseProxyView, self).dispatch(request, path)

        if x.get("Content-Type").split(";")[0] == "text/html":
            if x.__class__.__name__ == "StreamingHttpResponse":
                pass
            else:
                content_data = x.content.decode("utf-8")
                content_data = re.sub(r'"(?:(?:https?:\/\/))([^" >]+)"', self.baseUrl+r'\1', content_data)
                content_data = re.sub(r'"(?:(?:\/))([^">]+)"', self.baseUrl+domain+"/"+r'\1', content_data)
                x.content = content_data
                content_len = str(len(content_data))
                print(f'content Length: {content_len}')
                x._headers['content-length'] = ('Content-Length', content_len)

        return x
