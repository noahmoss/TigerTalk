from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='posts', on_delete=None)
    next_new_commenter = models.IntegerField(default=1) # anonymous id of the next new commenter
    content = models.TextField(max_length=5000)
    date_created = models.DateTimeField(auto_now_add=True)
    reported = models.BooleanField(default=False)
    readonly_fields=('author', 'date_created')

    def net_votes(self):
        return self.users_upvoted.count() - self.users_downvoted.count()

    def __str__(self):
        """A string representation of the post."""
        return self.content[:100]

    class Meta:
        ordering = ['-date_created']

class Comment(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments', on_delete=None)
    anon_author = models.IntegerField(default=-1) # anonymous id of the author
    content = models.CharField(max_length=2000)
    date_created = models.DateTimeField(auto_now_add=True)
    reported = models.BooleanField(default=False)
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    deleted = models.BooleanField(default=False)

    readonly_fields=('author', 'date_created', 'post')

    def net_votes(self):
        return self.users_upvoted.count() - self.users_downvoted.count()

    def __str__(self):
        """A string representation of the comment."""
        return self.content[:100]

    class Meta:
        ordering = ['date_created']

class User(AbstractUser):
    first_login = models.BooleanField(default=True)
    posts_upvoted = models.ManyToManyField(Post, related_name='users_upvoted', default=None, blank=True)
    posts_downvoted = models.ManyToManyField(Post, related_name='users_downvoted', default=None, blank=True)
    comments_upvoted = models.ManyToManyField(Comment, related_name='users_upvoted', default=None, blank=True)
    comments_downvoted = models.ManyToManyField(Comment, related_name='users_downvoted', default=None, blank=True)
