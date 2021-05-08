# Generated by Django 2.1.7 on 2019-03-15 10:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ebooklibrary', '0007_errorlog_importrun'),
    ]

    operations = [
        migrations.AddField(
            model_name='bookmodel',
            name='run',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='ebooklibrary.ImportRun'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='errorlog',
            name='run',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='ebooklibrary.ImportRun'),
            preserve_default=False,
        ),
    ]