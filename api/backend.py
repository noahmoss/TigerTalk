from django_cas_ng.backends import CASBackend
from django.contrib.auth import get_user_model

class CustomCASBackend(CASBackend):
    def get_user(self, user_id):
        try:
            User = get_user_model()
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
