# Generated by Django 2.1.7 on 2019-03-15 01:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ebooklibrary', '0004_auto_20190315_0120'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookmodel',
            name='release_date',
            field=models.DateField(blank=True, default='1.1.1989', null=True),
        ),
    ]