from rest_framework import viewsets, permissions
from shop.models import LineaPedido, Pago, Producto, Pedido, StockProducto
from shop.serializer import LineaPedidoSerializer, PagoSerializer, ProductoSerializer, PedidoSerializer, StockProductoSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        elif request.user.is_authenticated and hasattr(request.user, 'socio'):
            if view.action == 'list':
                # Los socios no pueden realizar peticiones 'list'
                return False
            elif view.action in ['retrieve', 'update', 'partial_update', 'destroy']:
                # Verificar que el socio solo pueda manipular objetos asociados a él
                return self._is_owner_or_admin(request, view)
            else:
                return True
        else:
            return False
    
    def _is_owner_or_admin(self, request, view):
        # Verificar si el usuario es propietario del objeto o un administrador
        obj = self._get_object(view)
        return request.user.is_authenticated and (
            request.user.is_staff or
            (hasattr(request.user, 'socio') and request.user.socio.id == obj.socio.id)
        )

    def _get_object(self, view):
        # Obtener el objeto específico de la solicitud
        return view.get_object()
    
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.AllowAny]
        elif self.request.method == 'GET':
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = PedidoSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.AllowAny]
        elif self.request.method == 'GET':
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class LineaPedidoViewSet(viewsets.ModelViewSet):
    queryset = LineaPedido.objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = LineaPedidoSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.AllowAny]
        elif self.request.method == 'GET':
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class StockProductoViewSet(viewsets.ModelViewSet):
    queryset = StockProducto.objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = StockProductoSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.IsAdminUser]
        elif self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]