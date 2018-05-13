from api.models import Post, Comment
from api.serializers import PostSerializer, CommentSerializer, UserSerializer
from api.permissions import IsAuthorOrReadOnly, IsUser
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.utils import timezone
import datetime
import smtplib
User = get_user_model()

# list of all posts
class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('content', 'comments__content')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# list of all posts sorted by vote count
class PostListByVotes(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        now = timezone.now()
        earliest_time = now - datetime.timedelta(days=7)
        return sorted(Post.objects.all().filter(date_created__range=[earliest_time, now]),
                            key=lambda x: -x.net_votes())

# detail for single post
class PostDetail(generics.RetrieveDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated, IsAuthorOrReadOnly,)

# list of comments associated with a post
class PostCommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = None

    def get_queryset(self):
        queryset = super(PostCommentList, self).get_queryset()
        return queryset.filter(post=self.kwargs.get('pk'))

    def create(self, request, *args, **kwargs):
        post = Post.objects.get(id=self.kwargs.get('pk'))
        post_author = post.author.id
        comments = Comment.objects.filter(post=self.kwargs.get('pk'))
        curr_author = self.request.user.id
        serializer = CommentSerializer(data=self.request.data)

        # see if this author matches a previous commenter
        is_new = True
        curr_id = -1
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

        serializer.is_valid()
        comment = serializer.save(author=self.request.user, anon_author=curr_id)

        headers = self.get_success_headers(serializer.data)
        return Response({"post" : post.id, "date_created" : timezone.now(), "anon_author" : curr_id, "id": comment.id },
                        status=status.HTTP_201_CREATED, headers=headers)


# list of all comments
class CommentList(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

# detail for a single comment
class CommentDetail(generics.RetrieveAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

# remove a comment (replace its text with "[DELETED]")
class CommentRemove(generics.ListAPIView):
        queryset = Comment.objects.all()
        serializer_class = CommentSerializer
        permission_classes = (permissions.IsAuthenticated,)

        def list(self, request, pk):
            user = request.user
            comment = Comment.objects.get(id=self.kwargs.get('pk'))
            if user.id != comment.author.id:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

            comment.content = "[deleted]"
            comment.deleted = True
            comment.save()
            return Response({"content":comment.content}, status=status.HTTP_202_ACCEPTED)

# upvote a post based on pk
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

# downvote a post based on pk
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

# clear the vote of a post based on pk
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

# upvote a comment based on pk
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

# downvote a comment based on pk
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

# clear the vote of a comment based on pk
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

# code to send email to superusers, adapted from
# https://stackoverflow.com/questions/10147455/how-to-send-an-email-with-gmail-as-provider-using-python/12424439#12424439
def send_email(user, pwd, recipient, subject, body):
    FROM = user
    TO = recipient if isinstance(recipient, list) else [recipient]
    SUBJECT = subject
    TEXT = body

    # Prepare actual message
    message = """From: %s\nTo: %s\nSubject: %s\n\n%s
    """ % (FROM, ", ".join(TO), SUBJECT, TEXT)
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.ehlo()
    server.starttls()
    server.login(user, pwd)
    server.sendmail(FROM, TO, message)
    server.close()

# report a post based on pk
class PostReport(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, pk):
        post = Post.objects.get(id=self.kwargs.get('pk'))
        post.reported = True
        post.save()

        superusers = User.objects.filter(is_superuser=True)
        superuser_emails = [superuser.username + "@princeton.edu" for superuser in superusers]
        subject = 'TigerTalk post ' + str(post.id) + ' has been reported.'
        message = 'Post #' + str(post.id) + ' with content below was reported on ' + str(timezone.now()) + '.'
        message += '\n\n\"' + post.content + '\"'
        message += '\n\n\n=====================================================\n'
        message += ("This email was sent because your TigerTalk account is "
                    "designated as a superuser.\nTo no longer receive "
                    "these emails, log on to the admin page and change your "
                    "account status.")

        send_email("noreply.tigertalk", "tigertalk333", superuser_emails, subject, message)

        return Response({"reported" : post.reported})

# report a comment based on pk
class CommentReport(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def list(self, request, pk):
        comment = Comment.objects.get(id=self.kwargs.get('pk'))
        comment.reported = True
        comment.save()

        superusers = User.objects.filter(is_superuser=True)
        superuser_emails = [superuser.username + "@princeton.edu" for superuser in superusers]
        subject = 'TigerTalk comment ' + str(comment.id) + ' has been reported.'
        message = 'Comment #' + str(comment.id) + ' on post #' + str(comment.post.id) + ' with content below was reported on ' + str(timezone.now()) + '.'
        message += '\n\n\"' + comment.content + '\"'
        message += '\n\n\n=====================================================\n'
        message += ("This email was sent because your TigerTalk account is "
                    "designated as a superuser.\nTo no longer receive "
                    "these emails, log on to the admin page and change your "
                    "account status.")

        send_email("noreply.tigertalk", "tigertalk333", superuser_emails, subject, message)

        return Response({"reported" : comment.reported})

# details of single user
class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated, IsUser,)

# set the "first_time" field for a user to false
# (called after a user sees the privacy notice)
class UserToggleFirstTime(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated, IsUser,)

    def list(self, request):
        user = request.user
        user.first_login = False
        user.save()
        return Response({"first_login" : False})
