from rest_framework import viewsets, permissions
from .models import Asunto, Balance, Cita, Clase, Colaborador, CursoEscolar, Evento, Hijo, Noticia, PagoCurso, Sugerencia, Vista
from .serializer import AsuntoSerializer, BalanceSerializer, CitaSerializer, ClaseSerializer, ColaboradorSerializer, CursoEscolarSerializer, EventoSerializer, HijoSerializer, NoticiaSerializer, PagoCursoSerializer, SugerenciaSerializer, VistaSerializer

class IsOwnerOrAdmin(permissions.BasePermission):
    # Custom permission to only allow owners of an object or admin users to access it.
    def has_object_permission(self, request, view, obj):
        # Check if the user is an admin
        if request.user.is_staff:
            return True
        # Check if the user is the owner of the object
        return obj.socio.id == request.user.id

class VistaViewSet(viewsets.ModelViewSet):
    queryset = Vista.objects.all()
    serializer_class = VistaSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = NoticiaSerializer

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    serializer_class = EventoSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class SugerenciaViewSet(viewsets.ModelViewSet):
    queryset = Sugerencia.objects.all()
    serializer_class = SugerenciaSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class ColaboradorViewSet(viewsets.ModelViewSet):
    queryset = Colaborador.objects.all()
    permission_classes = [permissions.IsAdminUser]
    serializer_class = ColaboradorSerializer

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    serializer_class = CitaSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

class AsuntoViewSet(viewsets.ModelViewSet):
    queryset = Asunto.objects.all()
    serializer_class = AsuntoSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class BalanceViewSet(viewsets.ModelViewSet):
    queryset = Balance.objects.all()
    serializer_class = BalanceSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class CursoEscolarViewSet(viewsets.ModelViewSet):
    queryset = CursoEscolar.objects.all()
    serializer_class = CursoEscolarSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class ClaseViewSet(viewsets.ModelViewSet):
    queryset = Clase.objects.all()
    serializer_class = ClaseSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

class HijoViewSet(viewsets.ModelViewSet):
    queryset = Hijo.objects.all()
    serializer_class = HijoSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwnerOrAdmin]
        return [permission() for permission in permission_classes]

class PagoCursoViewSet(viewsets.ModelViewSet):
    queryset = PagoCurso.objects.all()
    serializer_class = PagoCursoSerializer

    def get_permissions(self):
        if self.request.method == 'GET':
            # Check if the user is the owner of the object or an admin
            permission_classes = [IsOwnerOrAdmin]
        else:
            # Allow any authenticated user to create new PagoCurso objects
            permission_classes = [permissions.IsAuthenticated]
            # Only admins can modify existing PagoCurso objects
            if self.request.method in ['PUT', 'PATCH', 'DELETE']:
                permission_classes += [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]
