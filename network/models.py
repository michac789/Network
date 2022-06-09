from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    pass


class Post(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.ForeignKey(User, on_delete=models.CASCADE, related_name="post")
    title = models.CharField(max_length=64, default="")
    content = models.CharField(max_length=1024)
    time = models.DateTimeField(auto_now=True)
    

class FollowPair(models.Model):
    id = models.AutoField(primary_key=True)
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")


class LikePair(models.Model):
    id = models.AutoField(primary_key=True)
    liker = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liker")
    likedpost = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likedpost")
