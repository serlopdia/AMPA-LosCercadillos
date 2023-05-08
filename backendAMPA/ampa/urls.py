from django.urls import path
from rest_framework import routers

from .views import JoinEventoView
from .api import AsuntoViewSet, BalanceViewSet, CitaViewSet, ClaseViewSet, ColaboradorViewSet, CursoEscolarViewSet, EventoViewSet, HijoViewSet, NoticiaViewSet, PagoCursoViewSet, SugerenciaViewSet, VistaViewSet

router = routers.DefaultRouter()

router.register('vistas', VistaViewSet, basename='vistas')
router.register('noticias', NoticiaViewSet, basename='noticias')
router.register('eventos', EventoViewSet, basename='eventos')
router.register('sugerencias', SugerenciaViewSet, basename='sugerencias')
router.register('colaboradores', ColaboradorViewSet, basename='colaboradores')
router.register('citas', CitaViewSet, basename='citas')
router.register('asuntos', AsuntoViewSet, basename='asuntos')
router.register('balances', BalanceViewSet, basename='balances')
router.register('cursos_escolares', CursoEscolarViewSet, basename='cursos_escolares')
router.register('clases', ClaseViewSet, basename='clases')
router.register('hijos', HijoViewSet, basename='hijos')
router.register('pagos_cursos', PagoCursoViewSet, basename='pagos_cursos')

urlpatterns = router.urls

urlpatterns.extend([
    path('eventos/<int:pk>/join/', JoinEventoView.as_view(), name='join_evento'),
])