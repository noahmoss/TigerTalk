from django.db import models

class Post(models.Model):
    content = models.TextField(max_length=5000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        """A string representation of the post."""
        return self.content[:100]

class Comment(models.Model):
    content = models.CharField(max_length=2000)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)

    def __str__(self):
        """A string representation of the comment."""
        return self.content[:100]
