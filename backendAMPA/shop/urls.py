from django.urls import path
from rest_framework import routers

from shop.api import LineaPedidoViewSet, PagoViewSet, PedidoViewSet, ProductoViewSet, StockProductoViewSet
from shop.views import PagosSocioList, PedidosSocioList

router = routers.DefaultRouter()

router.register('productos', ProductoViewSet, basename='productos')
router.register('pagos', PagoViewSet, basename='pagos')
router.register('pedidos', PedidoViewSet, basename='pedidos')
router.register('lineapedidos', LineaPedidoViewSet, basename='lineapedidos')
router.register('stockproductos', StockProductoViewSet, basename='stockproductos')

urlpatterns = router.urls

urlpatterns.extend([
    path('pagos/socio/<int:pk>/', PagosSocioList.as_view(), name='pagos-socio'),
    path('pedidos/socio/<int:pk>/', PedidosSocioList.as_view(), name='pedidos-socio'),
])