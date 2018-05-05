from api.models import Post, Comment
from api.serializers import PostSerializer, CommentSerializer, UserSerializer
from api.permissions import IsAuthorOrReadOnly, IsUser
from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.shortcuts import render_to_response
from django.template import RequestContext
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
        earliest_time = now - datetime.timedelta(days=7)
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
    pagination_class = None

    def get_queryset(self):
        queryset = super(PostCommentList, self).get_queryset()
        return queryset.filter(post=self.kwargs.get('pk'))

    def perform_create(self, serializer):
        post = Post.objects.get(id=self.kwargs.get('pk'))
        post_author = post.author.id
        comments = Comment.objects.filter(post=self.kwargs.get('pk'))
        curr_author = self.request.user.id
        serializer = CommentSerializer(data=self.request.data)

        # see if this author matches a previous commenter
        is_new = True
        curr_id = 100
        if curr_author == post_author:
            curr_id = 0
            is_new = False
        else:
            for comment in comments:
                if comment.author.id == curr_author:
                    curr_id = comment.anon_author
                    is_new = False
                    break
        if is_new:
            curr_id = post.next_new_commenter
            post.next_new_commenter += 1
            post.save()

        if serializer.is_valid():
            serializer.save(author=self.request.user, anon_author=curr_id)

# list of all comments
# methods: GET, POST
class CommentList(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

# detail for a single comment
# use PUT to overwrite comment rather than deleting (TODO)
# methods: GET, PUT
class CommentDetail(generics.RetrieveDestroyAPIView):
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

class PostReport(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, pk):
        post = Post.objects.get(id=self.kwargs.get('pk'))
        post.reported = True
        post.save()
        return Response({"reported" : post.reported})

class CommentReport(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, pk):
        comment = Comment.objects.get(id=self.kwargs.get('pk'))
        comment.reported = True
        comment.save()
        return Response({"reported" : comment.reported})

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

# custom 404 handler
# def handler404(request):
#     response = render_to_response('404.html', {},
#                                   context_instance=RequestContext(request))
#     response.status_code = 404
#     return response
