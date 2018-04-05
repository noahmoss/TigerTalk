from rest_framework import serializers
from . import models

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        fields = (
            'user',
            'text',
            'timestamp',
        )
        model = models.Post
