from django.core.management.base import BaseCommand
from ebooklibrary.models import BookModel, googleBooksMetaDataSuggestions
from ast import literal_eval
import os
import re
import urllib.request
import json
import time

class Command(BaseCommand):
    help = 'Read Google API Metadata for book(s)'

    def handle(self, *args, **options):
        try:
            files = os.listdir('./googleBooksCache/')
        except FileNotFoundError as f:
            os.mkdir('./googleBooksCache/')
            files = []

        isbnPattern = re.compile("([0-9\-]{10,20})")
        uuidPattern = re.compile("([0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12})")
        awpPattern = re.compile("awp.*")
        print(f'Files loaded: {files}')

        for obj in BookModel.objects.filter(metaDataFromGoogle=False).exclude(isbn=u'').exclude(isbn=None):

            # scan ISBN
            if obj.isbn is None:
                continue

            isbnObj = obj.isbn
            if isbnObj is list:
                isbnObj = literal_eval(isbnObj)
            else:
                isbnObj = [isbnObj]

            for isbnEntry in isbnObj:

                if googleBooksMetaDataSuggestions.objects.filter(isbn=isbnEntry, book=obj).count() > 0:
                    continue

                isbnNmbr = re.search(isbnPattern,isbnEntry)
                uuid = re.search(uuidPattern,isbnEntry)
                awp = re.search(awpPattern,isbnEntry)
                if uuid is not None and uuid.group() is not None:
                    continue
                if awp is not None and awp.group() is not None:
                    continue
                if isbnNmbr is not None:
                    isbnNmbr = isbnNmbr.group()
                    if isbnNmbr is not None:
                        print(f'{isbnObj} / {isbnNmbr}')
                        isbnNmbr = isbnNmbr.replace('-','')

                        if isbnNmbr in files:

                            print(f"using cached {isbnNmbr}")
                            isbnFile = open(f'./googleBooksCache/{isbnNmbr}', 'r')
                            googleMeta = isbnFile.read()
                            isbnFile.close()

                        else:
                            with urllib.request.urlopen(f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbnNmbr}&key=AIzaSyBUaG7QkJrFrA8i-icYlbcEKntYu2AGnUs") as resp:
                                googleMeta = resp.read()
                                isbnFile = open(f'./googleBooksCache/{isbnNmbr}','wb')
                                isbnFile.write(googleMeta)
                                isbnFile.close()
                                files.append(isbnNmbr)
                                #print(f"fetched {isbnNmbr} - sleeping 1 sec.")
                                #time.sleep(1)


                        googleJson = json.loads(googleMeta)
                        if googleJson.get('items',None) is not None:
                            googleItem = googleJson['items'][0]
                            metaObj = googleBooksMetaDataSuggestions.objects.create(googleBooksID=googleItem['id'],
                                                                                    title=f"{googleItem['volumeInfo']['title']}",
                                                                                    author=googleItem['volumeInfo']['authors'][0],
                                                                                    release_date=googleItem['volumeInfo'].get('publishedDate',''),
                                                                                    short_descr=googleItem['volumeInfo'].get('description',''),
                                                                                    thumbnailUrl=googleItem['volumeInfo'].get("imageLinks",{}).get("thumbnail",''),
                                                                                    item=googleMeta,
                                                                                    genre=googleItem['volumeInfo'].get("categories",[None])[0],
                                                                                    isbn=isbnNmbr,
                                                                                    book=obj
                                                                                    )
                            metaObj.save()


        print(f"total number of books fetched: {len(files)}")