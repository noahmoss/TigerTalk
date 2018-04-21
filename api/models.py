from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser

class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='posts', on_delete=None)
    content = models.TextField(max_length=5000)
    date_created = models.DateTimeField(auto_now_add=True)

    readonly_fields=('author', 'date_created')

    def total_votes(self):
        return self.users_upvoted.count() - self.users_downvoted.count()

    def __str__(self):
        """A string representation of the post."""
        return self.content[:100]

    class Meta:
        ordering = ['-date_created']

class Comment(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='comments', on_delete=None)
    content = models.CharField(max_length=2000)
    date_created = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)

    readonly_fields=('author', 'date_created', 'post')

    def total_votes(self):
        return self.users_upvoted.count() - self.users_downvoted.count()

    def __str__(self):
        """A string representation of the comment."""
        return self.content[:100]

    class Meta:
        ordering = ['date_created']

class User(AbstractUser):
    posts_upvoted = models.ManyToManyField(Post, related_name='users_upvoted', default=None, blank=True)
    posts_downvoted = models.ManyToManyField(Post, related_name='users_downvoted', default=None, blank=True)
    comments_upvoted = models.ManyToManyField(Comment, related_name='users_upvoted', default=None, blank=True)
    comments_downvoted = models.ManyToManyField(Comment, related_name='users_downvoted', default=None, blank=True)
