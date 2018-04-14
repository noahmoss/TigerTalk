from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter
from posts import views

urlpatterns = [
    # path('api/posts/', views.PostList.as_view()),
    # path('api/posts/<int:pk>/', views.PostDetail.as_view()),
    # path('api/posts/<int:pk>/comments/', views.PostCommentList.as_view()),
    # path('api/comments/', views.CommentList.as_view()),
    # path('api/comments/<int:pk>/', views.CommentDetail.as_view()),

    #
    path('', views.PostListView.as_view(), name='home'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
