from django.urls import path
from rest_framework import routers

from shop.api import LineaPedidoViewSet, PagoViewSet, PedidoViewSet, ProductoViewSet

router = routers.DefaultRouter()

router.register('producto', ProductoViewSet, basename='producto')
router.register('pago', PagoViewSet, basename='pago')
router.register('pedido', PedidoViewSet, basename='pedido')
router.register('lineapedido', LineaPedidoViewSet, basename='lineapedido')

urlpatterns = router.urls

urlpatterns.extend([
])