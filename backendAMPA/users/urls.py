from rest_framework import routers
from .api import AdministradorViewSet, SocioViewSet

router = routers.DefaultRouter()

router.register('socios', SocioViewSet, basename='socios')
router.register('administradores', AdministradorViewSet, basename='administradores')

urlpatterns = router.urls