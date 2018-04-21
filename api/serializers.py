from rest_framework import serializers
from api.models import Post, Comment, User
# from django.contrib.auth.models import User

class CommentSerializer(serializers.ModelSerializer):
    # author = serializers.ReadOnlyField(source='author.username')
    class Meta:
        model = Comment
        fields = (
            'id',
            'author',
            'date_created',
            'post',
            'content',
            'net_votes',
        )

# TODO: figure out way to just pass # of comments
class PostSerializer(serializers.ModelSerializer):
    # author = serializers.ReadOnlyField(source='author.username')
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = (
            'id',
            'date_created',
            'content',
            'comments',
            'net_votes',
        )

class UserSerializer(serializers.ModelSerializer):
    # posts = PostSerializer(many=True)
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'posts',
            'posts_upvoted',
            'posts_downvoted',
            'comments_upvoted',
            'comments_downvoted',
        )
