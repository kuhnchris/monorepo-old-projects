from django.core.management.base import BaseCommand
from ebooklibrary.models import BookModel, ImportRun, ErrorLog

from django.core.files.base import ContentFile

import os
import io
from PIL import Image, ImageMode
from ebooklib import epub


def reportError(errorText, runName, level, e):
    try:
        ErrorLog.objects.create(run=runName, full_text=errorText, stage=level, message=e).save()
        print(errorText)
    except Exception as x:
        print(f"!!! Exception writting error Report: {x}")
        os._exit(2)


class Command(BaseCommand):
    help = 'Import ebooks'

    def add_arguments(self, parser):
        parser.add_argument('path', nargs='+', type=str)
        parser.add_argument('run', nargs='+', type=str)

    def handle(self, *args, **options):
        try:
            myRun = ImportRun.objects.create(name=options['run'][0])
            myRun.save()

            print(f'generated run: {myRun.id}')
        except Exception as q:
            print(f"Could not generate run! {q}")

        myPath = options['path'][0]
        print(myPath)
        for myFile in os.listdir(myPath):
            myFilePath = myPath + "/" + myFile
            if BookModel.objects.filter(path=myFilePath).count() > 0:
                continue

            # print(f"reading book: {myFilePath}")
            book = None
            title = ""
            auth = ""
            date = None
            cover = None
            imgContent = None
            img = None
            f = None

            try:
                book = epub.read_epub(myFilePath)
                try:
                    title = book.get_metadata('DC', 'title')[0][0]
                except Exception as e:
                    reportError(errorText=f"[~] {myFile}: could not extract title... - {e}", runName=myRun, level="~",
                                e=e)
                    title = myFile

                try:
                    auth = book.get_metadata('DC', 'creator')[0][0]
                except Exception as e:
                    reportError(errorText=f"[~] {myFile}: could not extract author... - {e}", runName=myRun, level="~",
                                e=e)
                    author = ""
                    #continue

                try:
                    isbn = book.get_metadata('DC', 'identifier')[0][0]
                    if BookModel.objects.filter(isbn=isbn).count() > 0:
                        continue

                except Exception as e:
                    reportError(errorText=f"[~] {myFile}: no identifier / ISBN", runName=myRun, level="~",
                                e=e)

                try:
                    date = book.get_metadata('DC', 'date')[1][0]
                except Exception as e:
                    reportError(errorText=f"[~] {myFile}: no create date of book in tags", runName=myRun, level="~",
                                e=e)

                try:
                    cover = book.get_metadata('OPF', 'cover')
                    f = book.get_metadata('OPF', 'cover')[0][1]['content']
                    g = book.get_item_with_id(f)
                    filecnt = g.get_content()
                    try:
                        img = Image.open(io.BytesIO(filecnt))
                        img = img.resize((200, 300))
                        imgContent = io.BytesIO()
                        img.save(imgContent, "PNG")
                    except Exception as e:
                        reportError(
                            errorText=f"[~] {myFile}: cannot convert cover: {e} - {myFilePath} - {book} - {date} - {auth} - {title} - {cover}",
                            runName=myRun, level="~",
                            e=e)
                except Exception as e:
                    reportError(
                        errorText=f"[~] {myFile}: cannot determinate cover! {e} - {myFilePath} - {book} - {date} - {auth} - {title} - {cover}",
                        runName=myRun, level="~",
                        e=e)

                print(f"[*] Book: {myFile} => {auth} - {title}")

                try:
                    # pass
                    bookEntry = BookModel.objects.create(run=myRun, title=title, author=auth, path=myFilePath,
                                                         release_date=date, isbn={isbn}, raw_metadata=book.metadata)
                    if imgContent is not None:
                        fileName = f'{isbn}.png'
                        if isbn is None:
                            fileName = f'{auth}-{title}.png'
                        fileContent = ContentFile(imgContent.getvalue())
                        bookEntry.cover.save(name=fileName, content=fileContent, save=True)

                    bookEntry.save()
                except Exception as e:
                    reportError(
                        errorText=f"[!] {myFile}: cannot write to database: {e} - {myFilePath} - {book} - {date} - {auth} - {title} - {cover}",
                        runName=myRun, level="!",
                        e=e)
            except Exception as e:
                reportError(
                    errorText=f"[!] {myFile}: cannot open book: {e} - {myFilePath} - {book} - {date} - {auth} - {title} - {cover}",
                    runName=myRun, level="!",
                    e=e)
