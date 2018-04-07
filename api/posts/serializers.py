from rest_framework import serializers
from . import models

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'user',
            'content',
            'timestamp',
            'votes',
            'reported',
        )
        model = models.Post
