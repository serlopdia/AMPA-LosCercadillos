from .models import Asunto, Balance, Cita, Clase, Colaborador, Curso, CursoEscolar, Evento, Hijo, Noticia, PagoCurso, Sugerencia, Vista
from rest_framework import viewsets, permissions
from .serializer import AsuntoSerializer, BalanceSerializer, CitaSerializer, ClaseSerializer, ColaboradorSerializer, CursoEscolarSerializer, CursoSerializer, EventoSerializer, HijoSerializer, NoticiaSerializer, PagoCursoSerializer, SugerenciaSerializer, VistaSerializer

class VistaViewSet(viewsets.ModelViewSet):
    queryset = Vista.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = VistaSerializer

class NoticiaViewSet(viewsets.ModelViewSet):
    queryset = Noticia.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = NoticiaSerializer

class EventoViewSet(viewsets.ModelViewSet):
    queryset = Evento.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = EventoSerializer

class SugerenciaViewSet(viewsets.ModelViewSet):
    queryset = Sugerencia.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = SugerenciaSerializer

class ColaboradorViewSet(viewsets.ModelViewSet):
    queryset = Colaborador.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ColaboradorSerializer

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CitaSerializer

class AsuntoViewSet(viewsets.ModelViewSet):
    queryset = Asunto.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = AsuntoSerializer

class BalanceViewSet(viewsets.ModelViewSet):
    queryset = Balance.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = BalanceSerializer

class CursoEscolarViewSet(viewsets.ModelViewSet):
    queryset = CursoEscolar.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = CursoEscolarSerializer

class ClaseViewSet(viewsets.ModelViewSet):
    queryset = Clase.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = ClaseSerializer

class HijoViewSet(viewsets.ModelViewSet):
    queryset = Hijo.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = HijoSerializer

class PagoCursoViewSet(viewsets.ModelViewSet):
    queryset = PagoCurso.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = PagoCursoSerializer