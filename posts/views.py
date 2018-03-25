from django.http import HttpResponse
from rest_framework import generics
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer


class PostList(generics.ListCreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
