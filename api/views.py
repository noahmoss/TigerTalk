from api.models import Post, Comment
from api.serializers import PostSerializer, CommentSerializer, UserSerializer
from api.permissions import IsAuthorOrReadOnly, IsUser
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.utils import timezone
import datetime
User = get_user_model()

# list of all posts
# methods: GET, POST
class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class PostListByVotes(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        now = timezone.now()
        earliest_time = now - datetime.timedelta(hours=24)
        return sorted(Post.objects.all().filter(date_created__range=[earliest_time, now]),
                            key=lambda x: -x.net_votes())

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
# use PUT to overwrite comment rather than deleting
# methods: GET, PUT
class CommentDetail(generics.RetrieveUpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

# upvote a post based on pk
# methods: GET
class PostUpvote(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, pk):
        user = request.user
        post = Post.objects.get(id=self.kwargs.get('pk'))
        user.posts_upvoted.add(post)
        user.posts_downvoted.remove(post)
        return Response({"net_votes" : post.net_votes()})

class PostDownvote(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, pk):
        user = request.user
        post = Post.objects.get(id=self.kwargs.get('pk'))
        user.posts_downvoted.add(post)
        user.posts_upvoted.remove(post)
        return Response({"net_votes" : post.net_votes()})

class PostClearVote(generics.ListAPIView):
        queryset = Post.objects.all()
        serializer_class = PostSerializer
        permission_classes = (permissions.IsAuthenticated,)

        def list(self, request, pk):
            user = request.user
            post = Post.objects.get(id=self.kwargs.get('pk'))
            user.posts_downvoted.remove(post)
            user.posts_upvoted.remove(post)
            return Response({"net_votes" : post.net_votes()})

class CommentUpvote(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, pk):
        user = request.user
        comment = Comment.objects.get(id=self.kwargs.get('pk'))
        user.comments_upvoted.add(comment)
        user.comments_downvoted.remove(comment)
        return Response({"net_votes" : comment.net_votes()})

class CommentDownvote(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, pk):
        user = request.user
        comment = Comment.objects.get(id=self.kwargs.get('pk'))
        user.comments_downvoted.add(comment)
        user.comments_upvoted.remove(comment)
        return Response({"net_votes" : comment.net_votes()})

class CommentClearVote(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, pk):
        user = request.user
        comment = Comment.objects.get(id=self.kwargs.get('pk'))
        user.comments_downvoted.remove(comment)
        user.comments_upvoted.remove(comment)
        return Response({"net_votes" : comment.net_votes()})

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
