from django import template
from django.template import loader, context

register = template.Library()

# @register.inclusion_tag('bootstrap_toast.html')

@register.inclusion_tag('dummy_template_extender.html')
def toast(title, subtitle, content):
    return {'template_name': 'bootstrap_toast.html'}