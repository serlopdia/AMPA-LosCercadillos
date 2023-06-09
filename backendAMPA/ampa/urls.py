from django.urls import path
from rest_framework import routers

from .views import JoinEventoView, CitasSocioList, HijosSocioList, PagosCursoSocioList, AsuntoDisponibilidadDia, LeaveEventoView, CreateCuotaCheckoutSession, StripeWebHook
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
router.register('pagos_curso', PagoCursoViewSet, basename='pagos_curso')

urlpatterns = router.urls

urlpatterns.extend([
    path('eventos/<int:pk>/join/', JoinEventoView.as_view(), name='join-evento'),
    path('eventos/<int:pk>/leave/', LeaveEventoView.as_view(), name='leave-evento'),
    path('citas/socio/<int:pk>/', CitasSocioList.as_view(), name='citas-socio'),
    path('hijos/socio/<int:pk>/', HijosSocioList.as_view(), name='hijos-socio'),
    path('pagos_curso/socio/<int:pk>/', PagosCursoSocioList.as_view(), name='pagos_curso-socio'),
    path('pagos_curso/create-pago-stripe/', CreateCuotaCheckoutSession.as_view(), name='create-pago-stripe'),
    path('disponibilidad_asunto/', AsuntoDisponibilidadDia.as_view(), name='asunto-disponibilidad'),
    path('checkout_cuota/', CreateCuotaCheckoutSession.as_view(), name='checkout'),
    path('stripe-webhook/', StripeWebHook.as_view(), name='stripe-webhook'),
])