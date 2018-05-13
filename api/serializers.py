from rest_framework import serializers
from api.models import Post, Comment
from django.contrib.auth import get_user_model
User = get_user_model()

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = (
            'id',
            'date_created',
            'anon_author',
            'post',
            'content',
            'net_votes',
            'reported',
            'deleted',
        )
        read_only_fields = ('id','author','date_created',)

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
    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'first_login',
            'posts',
            'comments',
            'posts_upvoted',
            'posts_downvoted',
            'comments_upvoted',
            'comments_downvoted',
        )
