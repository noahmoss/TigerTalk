from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    author = models.ForeignKey(User, related_name='posts', on_delete=None)
    content = models.TextField(max_length=5000)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """A string representation of the post."""
        return self.content[:100]

    class Meta:
        ordering = ['-date_created']

class Comment(models.Model):
    author = models.ForeignKey(User, related_name='comments', on_delete=None)
    content = models.CharField(max_length=2000)
    date_created = models.DateTimeField(auto_now_add=True)
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)

    def __str__(self):
        """A string representation of the comment."""
        return self.content[:100]

    class Meta:
        ordering = ['date_created']
