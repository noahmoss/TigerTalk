from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.routers import DefaultRouter
from posts import views

urlpatterns = [
    path('', views.PostList.as_view()),
    path('<int:pk>/', views.PostDetail.as_view()),
    path('<int:pk>/comments/', views.CommentList.as_view()),
    path('<int:pk>/comments/<int:id>/', views.CommentDetail.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)


# from django.urls import path
# from posts.views import PostViewSet, CommentViewSet
# from rest_framework.routers import DefaultRouter
#
# router = DefaultRouter()
# router.register('', PostViewSet, base_name='posts')
# router.register('comments', CommentViewSet, base_name='comments')
# urlpatterns = router.urls
