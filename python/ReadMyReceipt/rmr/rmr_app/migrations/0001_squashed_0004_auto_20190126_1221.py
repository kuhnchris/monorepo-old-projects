# Generated by Django 2.1.5 on 2019-01-26 14:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    replaces = [('rmr_app', '0001_initial'), ('rmr_app', '0002_auto_20190126_1113'), ('rmr_app', '0003_auto_20190126_1211'), ('rmr_app', '0004_auto_20190126_1221')]

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='OCRBox',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('startPointX', models.IntegerField()),
                ('startPointY', models.IntegerField()),
                ('endPointX', models.IntegerField()),
                ('endPointY', models.IntegerField()),
                ('content', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='UploadFile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='upload')),
            ],
        ),
        migrations.AddField(
            model_name='ocrbox',
            name='file',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rmr_app.UploadFile'),
        ),
        migrations.AddField(
            model_name='ocrbox',
            name='parentBox',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='rmr_app.OCRBox'),
        ),
        migrations.CreateModel(
            name='OCRTask',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('finished', models.BooleanField(default=False)),
                ('inprogress', models.BooleanField(default=False)),
                ('file', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rmr_app.UploadFile')),
            ],
        ),
        migrations.AddField(
            model_name='ocrbox',
            name='task',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='rmr_app.OCRTask'),
        ),
    ]
