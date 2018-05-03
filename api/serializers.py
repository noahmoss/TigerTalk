from rest_framework import serializers
from api.models import Post, Comment
from django.contrib.auth import get_user_model
User = get_user_model()

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = (
            'id',
            'author', # TODO: anonymize
            'date_created',
            'post',
            'content',
            'net_votes',
            'reported',
        )
        read_only_fields = ('id','author','date_created',)

# TODO: figure out way to just pass # of comments
class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = (
            'id',
            'date_created',
            'content',
            'comments',
            'net_votes',
            'reported',
        )

class UserSerializer(serializers.ModelSerializer):
    # posts = PostSerializer(many=True)
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'posts',
            'comments',
            'posts_upvoted',
            'posts_downvoted',
            'comments_upvoted',
            'comments_downvoted',
        )
