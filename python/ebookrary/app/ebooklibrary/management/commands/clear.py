from django.core.management.base import BaseCommand
from ebooklibrary.models import BookModel

from django.core.files.base import ContentFile

import os
import io
from PIL import Image, ImageMode
from ebooklib import epub

class Command(BaseCommand):
    help = 'Clear ebooks'

    def handle(self, *args, **options):
       print(BookModel.objects.all().delete())
