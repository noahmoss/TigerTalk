from api.models import Post, Comment
from api.serializers import PostSerializer, CommentSerializer, UserSerializer
from api.permissions import IsAuthorOrReadOnly, IsUser
from django.contrib.auth.models import User
from rest_framework import generics, permissions

# list of all posts
# methods: GET, POST
class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# detail for single post
# methods: GET, DELETE
class PostDetail(generics.RetrieveDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated, IsAuthorOrReadOnly,)

# list of comments associated with a post
# methods: GET, POST
class PostCommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        queryset = super(PostCommentList, self).get_queryset()
        return queryset.filter(post=self.kwargs.get('pk'))

    #TODO: automatically fill 'post' field based on url?
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# list of all comments
# methods: GET, POST
class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# detail for a single comment
# methods: GET, DELETE
class CommentDetail(generics.RetrieveDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

# list of all users (only available to admins; for debugging purposes)
# TODO: remove in production
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAdminUser,)

# details of single user
class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated, IsUser,)

# list of posts from a single user
# class UserPostList(generics.ListAPIView):
#         queryset = Post.objects.all()
#         serializer_class = PostSerializer
#         permission_classes = (permissions.IsAuthenticated, IsUser,)
#
#         def get_queryset(self):
#             queryset = super(UserPostList, self).get_queryset()
#             return queryset.filter(author=self.kwargs.get('pk'))
