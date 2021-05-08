# Generated by Django 2.1.4 on 2018-12-16 18:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('finance', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='closingledger',
            name='changed_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='closingledger',
            name='created_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='currency',
            name='changed_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='currency',
            name='created_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='invoicehead',
            name='changed_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='invoicehead',
            name='created_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='invoiceposition',
            name='changed_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='invoiceposition',
            name='created_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='ledger',
            name='changed_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='ledger',
            name='created_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='vendor',
            name='changed_on',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='vendor',
            name='created_on',
            field=models.DateTimeField(auto_now=True),
        ),
    ]