from .models import Administrador, Socio
from rest_framework import viewsets, permissions
from .serializer import AdministradorSerializer, SocioSerializer

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

class SocioViewSet(viewsets.ModelViewSet):
    queryset = Socio.objects.all()
    serializer_class = SocioSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = AdministradorSerializer