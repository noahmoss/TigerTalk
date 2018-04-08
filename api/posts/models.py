from django.db import models

class Post(models.Model):
    user = models.CharField(max_length=20)
    content = models.CharField(max_length=5000)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """A string representation of the post."""
        return self.content[:50]

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.CharField(max_length=20)
    content = models.CharField(max_length=2000)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """A string representation of the comment."""
        return self.content[:50]
