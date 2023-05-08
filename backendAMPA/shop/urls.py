from django.urls import path
from rest_framework import routers

router = routers.DefaultRouter()

""" router.register('socios', SocioViewSet, basename='socios')
router.register('administradores', AdministradorViewSet, basename='administradores') """

urlpatterns = router.urls

urlpatterns.extend([
])