# Generated by Django 2.1.7 on 2019-03-24 12:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reverseproxyapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AttemptedDomainCall',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('domain', models.CharField(max_length=100)),
                ('path', models.CharField(max_length=100)),
            ],
        ),
        migrations.RenameModel(
            old_name='AllowedDomains',
            new_name='AllowedDomain',
        ),
        migrations.RenameField(
            model_name='alloweddomain',
            old_name='baseURL',
            new_name='domain',
        ),
    ]
