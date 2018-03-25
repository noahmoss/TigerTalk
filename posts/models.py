from django.db import models
from django.utils import timezone

class Post(models.Model):
    user = models.CharField(default='default_user', max_length=15)
    text = models.CharField(null=True, max_length=500)
    score = models.IntegerField(default=0)
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
         return self.text[:50]
