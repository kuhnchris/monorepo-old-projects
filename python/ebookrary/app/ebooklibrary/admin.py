from django.contrib import admin
from .models import BookModel, ImportRun, ErrorLog,googleBooksMetaDataSuggestions
from django.utils.html import mark_safe
# Register your models here.


class BookInline(admin.TabularInline):
    model = BookModel

class bookAdmin(admin.ModelAdmin):
    list_display = (('author', 'title', 'image_tag'))
    list_filter = ('author',)
    search_fields = ('author','title')

    def image_tag(self, obj):
        return mark_safe(f'<img src="/%s" />' % obj.cover)

    image_tag.short_description = 'Image'
    image_tag.allow_tags = True

    change_list_template = 'example.html'

class runAdmin(admin.ModelAdmin):
    pass

class googleMetaAdmin(admin.ModelAdmin):
    search_fields = ('isbn','author', 'title')
    list_display = ('isbn','author','title')

class errorLogAdmin(admin.ModelAdmin):
    list_display = ('stage','full_text','run')
    list_filter = ('stage','message','run')

admin.site.register(BookModel, bookAdmin)
admin.site.register(ErrorLog, errorLogAdmin)
admin.site.register(ImportRun, runAdmin)
admin.site.register(googleBooksMetaDataSuggestions, googleMetaAdmin)