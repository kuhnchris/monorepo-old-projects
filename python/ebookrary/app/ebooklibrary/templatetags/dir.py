from django import template
from see import see

register = template.Library()


@register.simple_tag(name='dirTag')
def dirTag(value):
    """Removes all values of arg from the given string"""
    return see(value)

