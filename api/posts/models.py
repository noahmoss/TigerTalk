from django.db import models

# Create your models here.
class Post(models.Model):
    postID = models.IntegerField()
    user = models.CharField(max_length=20)
    text = models.TextField(max_length=5000)
    timestamp = models.DateTimeField()

    def __str__(self):
        """A string representation of the post."""
        return self.text[:50]
