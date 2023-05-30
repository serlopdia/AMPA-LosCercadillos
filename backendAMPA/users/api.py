from .models import Administrador, Socio
from rest_framework import viewsets, permissions
from .serializer import AdministradorSerializer, SocioSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    # Custom permission to only allow owners of an object or admin users to access it.
    def has_object_permission(self, request, view, obj):
        # Check if the user is an admin
        if request.user.is_staff:
            return True
        # Check if the user is the owner of the object
        return obj.user == request.user

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