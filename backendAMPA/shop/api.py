from rest_framework import viewsets, permissions
from shop.models import LineaPedido, Pago, Producto, Pedido, StockProducto
from shop.serializer import LineaPedidoSerializer, PagoSerializer, ProductoSerializer, PedidoSerializer, StockProductoSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    # Custom permission to only allow owners of an object or admin users to access it.
    def has_object_permission(self, request, view, obj):
        # Check if the user is an admin
        if request.user.is_staff:
            return True
        # Check if the user is the owner of the object
        return obj.socio.id == request.user.id

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
            permission_classes = [permissions.AllowAny]
        elif self.request.method == 'GET':
            permission_classes = [IsOwnerOrAdmin]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]