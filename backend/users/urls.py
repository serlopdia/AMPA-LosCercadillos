from rest_framework import routers
from .api import SocioViewSet

router = routers.DefaultRouter()

router.register('', SocioViewSet, basename='socios')

urlpatterns = router.urls