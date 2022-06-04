# Generated by Django 4.0.4 on 2022-06-03 03:32

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0004_alter_post_content'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='like',
        ),
        migrations.CreateModel(
            name='LikePair',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('likedpost', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likedpost', to='network.post')),
                ('liker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='liker', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]