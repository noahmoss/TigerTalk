from posts.models import Post, Comment
from posts.serializers import PostSerializer, CommentSerializer
from rest_framework import generics

class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = super(CommentList, self).get_queryset()
        return queryset.filter(post=self.kwargs.get('pk'))

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = 'id'


# from rest_framework import viewsets
# from posts import models
# from . import serializers
#
# class PostViewSet(viewsets.ModelViewSet):
#     queryset = models.Post.objects.all()
#     serializer_class = serializers.PostSerializer
#
# class CommentViewSet(viewsets.ModelViewSet):
#     queryset = models.Comment.objects.all()
#     serializer_class = serializers.CommentSerializer
