from django.urls import path
from rest_framework import routers

from .views import LoginView, LogoutView
from .api import AdministradorViewSet, SocioViewSet

router = routers.DefaultRouter()

router.register('socios', SocioViewSet, basename='socios')
router.register('administradores', AdministradorViewSet, basename='administradores')

urlpatterns = router.urls

urlpatterns.extend([
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
])