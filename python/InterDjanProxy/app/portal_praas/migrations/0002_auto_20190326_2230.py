# Generated by Django 2.1.7 on 2019-03-26 21:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('portal_praas', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='menuitem',
            name='sortOrder',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='portalitem',
            name='sortOrder',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='portalmessage',
            name='sortOrder',
            field=models.IntegerField(default=0),
        ),
    ]
