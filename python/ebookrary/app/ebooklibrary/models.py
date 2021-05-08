from django.db import models


class ImportRun(models.Model):
    name = models.CharField(max_length=100)

class BookModel(models.Model):
    title = models.TextField()
    author = models.TextField()
    cover = models.ImageField(upload_to='covers')
    path = models.CharField(max_length=256)
    release_date = models.DateField(default='1.1.1989',blank=True, null=True)
    raw_metadata = models.TextField(blank=True, null=True)
    isbn = models.CharField(max_length=100,blank=True, null=True)
    run = models.ForeignKey(ImportRun, on_delete=models.CASCADE)
    metaDataFromBook = models.BooleanField(default=True)
    metaDataFromGoogle = models.BooleanField(default=False)
    active = models.BooleanField(default=True)


class ErrorLog(models.Model):
    run = models.ForeignKey(ImportRun, on_delete=models.CASCADE)
    message = models.TextField()
    stage = models.TextField()
    full_text = models.TextField()


class googleBooksMetaDataSuggestions(models.Model):
    book = models.ForeignKey(BookModel, on_delete=None)
    item = models.TextField(blank=True, null=True)
    title = models.TextField(blank=True, null=True)
    googleBooksID = models.TextField(blank=True, null=True)
    short_descr = models.TextField(blank=True, null=True)
    author = models.TextField(blank=True, null=True)
    release_date = models.TextField(blank=True, null=True)
    genre = models.TextField(blank=True, null=True)
    thumbnailUrl = models.TextField(blank=True, null=True)
    isbn = models.TextField(blank=True, null=True)



