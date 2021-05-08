# Generated by Django 2.1.5 on 2019-01-26 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rmr_app', '0002_ocrtask_extended_resolve'),
    ]

    operations = [
        migrations.AddField(
            model_name='ocrtask',
            name='advanced_OCR',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='ocrtask',
            name='simple_OCR',
            field=models.BooleanField(default=True),
        ),
    ]