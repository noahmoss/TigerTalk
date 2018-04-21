from api.models import Post, Comment
from api.serializers import PostSerializer, CommentSerializer, UserSerializer
from api.permissions import IsAuthorOrReadOnly
from django.contrib.auth.models import User
from rest_framework import generics, permissions

class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostDetail(generics.RetrieveDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated, IsAuthorOrReadOnly,)

class PostCommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = super(PostCommentList, self).get_queryset()
        return queryset.filter(post=self.kwargs.get('pk'))

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class CommentDetail(generics.RetrieveDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserPostList(generics.ListAPIView):
        queryset = Post.objects.all()
        serializer_class = PostSerializer

        def get_queryset(self):
            queryset = super(UserPostList, self).get_queryset()
            return queryset.filter(author=self.kwargs.get('pk'))
