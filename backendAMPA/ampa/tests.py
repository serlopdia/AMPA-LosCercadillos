from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, force_authenticate
from .models import *
from .serializer import *
from .api import *
from .views import *

# Create your tests here.
class VistaViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = VistaViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.vista = Vista.objects.create(tipo='PRINCIPAL', markdown='Markdown existente')
        self.vista_data = {'tipo': 'COLEGIO', 'markdown': 'Markdown de prueba'}

    def test_get_vistas(self):
        request = self.factory.get('/ampa/vistas/')
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_vista(self):
        request = self.factory.post('/ampa/vistas/', self.vista_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_vista_required_fields(self):
        request = self.factory.post('/ampa/vistas/', {'tipo': 'PRINCIPAL'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_vista_by_id_valid(self):
        request = self.factory.get(f'/ampa/vistas/{self.vista.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.vista.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['tipo'], 'PRINCIPAL')
        self.assertEqual(response.data[0]['markdown'], self.vista.markdown)

    def test_update_vista(self):
        request = self.factory.put(f'/ampa/vistas/{self.vista.id}/', self.vista_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.vista.id)
        self.assertEqual(response.status_code, 200)

    def test_update_vista_invalid_id(self):
        request = self.factory.put('/ampa/vistas/999/', self.vista_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_vista(self):
        request = self.factory.delete(f'/ampa/vistas/{self.vista.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.vista.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_vista_invalid_id(self):
        request = self.factory.delete('/ampa/vistas/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class NoticiaViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = NoticiaViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.noticia = Noticia.objects.create(titulo='Noticia existente', cuerpo='Cuerpo existente')
        self.noticia_data = {'titulo': 'Título de prueba', 'cuerpo': 'Cuerpo de prueba'}

    def test_get_noticias(self):
        request = self.factory.get('/ampa/noticias/')
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_noticia(self):
        request = self.factory.post('/ampa/noticias/', self.noticia_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_noticia_required_fields(self):
        request = self.factory.post('/ampa/noticias/', {'titulo': 'Título sin cuerpo'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_noticia_by_id_valid(self):
        request = self.factory.get(f'/ampa/noticias/{self.noticia.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.noticia.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['titulo'], 'Noticia existente')
        self.assertEqual(response.data[0]['cuerpo'], self.noticia.cuerpo)

    def test_update_noticia(self):
        request = self.factory.put(f'/ampa/noticias/{self.noticia.id}/', self.noticia_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.noticia.id)
        self.assertEqual(response.status_code, 200)

    def test_update_noticia_invalid_id(self):
        request = self.factory.put('/ampa/noticias/999/', self.noticia_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_noticia(self):
        request = self.factory.delete(f'/ampa/noticias/{self.noticia.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.noticia.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_noticia_invalid_id(self):
        request = self.factory.delete('/ampa/noticias/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class EventoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = EventoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.evento = Evento.objects.create(
            titulo='Evento existente',
            descripcion='Descripción existente',
            capacidad=100,
            fin_inscripcion=datetime.now(timezone.utc) + timedelta(days=1),
            visible=True
        )
        self.socio1 = Socio.objects.create(user=User.objects.create(username='socio1', email='socio1@example.com', password='password321'), tel='987654321', dni='15412769D', address='Dirección de socio 1')
        self.socio2 = Socio.objects.create(user=User.objects.create(username='socio2', email='socio2@example.com', password='password123'), tel='123456789', dni='34030133T', address='Dirección de socio 2')
        self.evento_data = {
            'titulo': 'Título de prueba',
            'descripcion': 'Descripción de prueba',
            'capacidad': 50,
            'fin_inscripcion': datetime.now(timezone.utc) + timedelta(days=2),
            'socios': [self.socio1.id, self.socio2.id]
        }

    def test_get_eventos(self):
        request = self.factory.get('/ampa/eventos/')
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_evento(self):
        request = self.factory.post('/ampa/eventos/', self.evento_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_evento_required_fields(self):
        request = self.factory.post('/ampa/eventos/', {'titulo': 'Título sin descripción'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_evento_by_id_valid(self):
        request = self.factory.get(f'/ampa/eventos/{self.evento.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.evento.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['titulo'], 'Evento existente')
        self.assertEqual(response.data[0]['descripcion'], self.evento.descripcion)

    def test_update_evento(self):
        request = self.factory.put(f'/ampa/eventos/{self.evento.id}/', self.evento_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.evento.id)
        self.assertEqual(response.status_code, 200)

    def test_update_evento_invalid_id(self):
        request = self.factory.put('/ampa/eventos/999/', self.evento_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_evento(self):
        request = self.factory.delete(f'/ampa/eventos/{self.evento.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.evento.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_evento_invalid_id(self):
        request = self.factory.delete('/ampa/eventos/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class ColaboradorViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ColaboradorViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.colaborador = Colaborador.objects.create(
            nombre='Nombre existente',
            ventaja='Ventaja existente',
            descripcion='Descripción existente',
            imagen='imagen.jpg'
        )
        self.colaborador_data = {
            'nombre': 'Nombre de prueba',
            'ventaja': 'Ventaja de prueba',
            'descripcion': 'Descripción de prueba',
            'imagen': 'imagen.jpg'
        }

    def test_get_colaboradores(self):
        request = self.factory.get('/ampa/colaboradores/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_colaborador(self):
        request = self.factory.post('/ampa/colaboradores/', self.colaborador_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_colaborador_required_fields(self):
        request = self.factory.post('/ampa/colaboradores/', {'nombre': 'Nombre sin descripción'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_colaborador_by_id_valid(self):
        request = self.factory.get(f'/ampa/colaboradores/{self.colaborador.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.colaborador.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['nombre'], 'Nombre existente')
        self.assertEqual(response.data[0]['descripcion'], self.colaborador.descripcion)

    def test_update_colaborador(self):
        request = self.factory.put(f'/ampa/colaboradores/{self.colaborador.id}/', self.colaborador_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.colaborador.id)
        self.assertEqual(response.status_code, 200)

    def test_update_colaborador_invalid_id(self):
        request = self.factory.put('/ampa/colaboradores/999/', self.colaborador_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_colaborador(self):
        request = self.factory.delete(f'/ampa/colaboradores/{self.colaborador.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.colaborador.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_colaborador_invalid_id(self):
        request = self.factory.delete('/ampa/colaboradores/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class SugerenciaViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = SugerenciaViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.sugerencia = Sugerencia.objects.create(
            nombre='Nombre existente',
            email='test@example.com',
            titulo='Título existente',
            descripcion='Descripción existente'
        )
        self.sugerencia_data = {
            'nombre': 'Nombre de prueba',
            'email': 'test@example.com',
            'titulo': 'Título de prueba',
            'descripcion': 'Descripción de prueba'
        }

    def test_get_sugerencias(self):
        request = self.factory.get('/ampa/sugerencias/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_sugerencia(self):
        request = self.factory.post('/ampa/sugerencias/', self.sugerencia_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_sugerencia_required_fields(self):
        request = self.factory.post('/ampa/sugerencias/', {'nombre': 'Nombre sin email'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_sugerencia_by_id_valid(self):
        request = self.factory.get(f'/ampa/sugerencias/{self.sugerencia.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.sugerencia.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['nombre'], 'Nombre existente')
        self.assertEqual(response.data[0]['titulo'], self.sugerencia.titulo)

    def test_update_sugerencia(self):
        request = self.factory.put(f'/ampa/sugerencias/{self.sugerencia.id}/', self.sugerencia_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.sugerencia.id)
        self.assertEqual(response.status_code, 200)

    def test_update_sugerencia_invalid_id(self):
        request = self.factory.put('/ampa/sugerencias/999/', self.sugerencia_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_sugerencia(self):
        request = self.factory.delete(f'/ampa/sugerencias/{self.sugerencia.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.sugerencia.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_sugerencia_invalid_id(self):
        request = self.factory.delete('/ampa/sugerencias/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class BalanceViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = BalanceViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.balance = Balance.objects.create(
            tipo='INGRESO',
            asunto='Asunto existente',
            cantidad=100
        )
        self.balance_data = {
            'tipo': 'INGRESO',
            'asunto': 'Asunto de prueba',
            'cantidad': 200
        }

    def test_get_balances(self):
        request = self.factory.get('/ampa/balances/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_balance(self):
        request = self.factory.post('/ampa/balances/', self.balance_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_balance_required_fields(self):
        request = self.factory.post('/ampa/balances/', {'tipo': 'INGRESO'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_balance_by_id_valid(self):
        request = self.factory.get(f'/ampa/balances/{self.balance.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.balance.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['tipo'], 'INGRESO')
        self.assertEqual(response.data[0]['asunto'], self.balance.asunto)

    def test_update_balance(self):
        request = self.factory.put(f'/ampa/balances/{self.balance.id}/', self.balance_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.balance.id)
        self.assertEqual(response.status_code, 200)

    def test_update_balance_invalid_id(self):
        request = self.factory.put('/ampa/balances/999/', self.balance_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_balance(self):
        request = self.factory.delete(f'/ampa/balances/{self.balance.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.balance.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_balance_invalid_id(self):
        request = self.factory.delete('/ampa/balances/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class CursoEscolarViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CursoEscolarViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.curso_escolar = CursoEscolar.objects.create(
            nombre='Curso escolar existente',
            precio_cuota=100.0,
            fecha_inicio=date(2022, 9, 1),
            fecha_fin=date(2023, 6, 30),
            actual=True
        )
        self.curso_escolar_data = {
            'nombre': 'Curso escolar de prueba',
            'precio_cuota': 200.0,
            'fecha_inicio': date(2023, 9, 1),
            'fecha_fin': date(2024, 6, 30),
            'actual': False
        }

    def test_get_cursos_escolares(self):
        request = self.factory.get('/ampa/cursos-escolares/')
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_curso_escolar(self):
        request = self.factory.post('/ampa/cursos-escolares/', self.curso_escolar_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_curso_escolar_required_fields(self):
        request = self.factory.post('/ampa/cursos-escolares/', {'nombre': 'Curso sin precio'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_curso_escolar_by_id_valid(self):
        request = self.factory.get(f'/ampa/cursos-escolares/{self.curso_escolar.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.curso_escolar.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['nombre'], 'Curso escolar existente')
        self.assertEqual(response.data[0]['precio_cuota'], self.curso_escolar.precio_cuota)

    def test_update_curso_escolar(self):
        request = self.factory.put(f'/ampa/cursos-escolares/{self.curso_escolar.id}/', self.curso_escolar_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.curso_escolar.id)
        self.assertEqual(response.status_code, 200)

    def test_update_curso_escolar_invalid_id(self):
        request = self.factory.put('/ampa/cursos-escolares/999/', self.curso_escolar_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_curso_escolar(self):
        request = self.factory.delete(f'/ampa/cursos-escolares/{self.curso_escolar.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.curso_escolar.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_curso_escolar_invalid_id(self):
        request = self.factory.delete('/ampa/cursos-escolares/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class ClaseViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ClaseViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.curso_escolar = CursoEscolar.objects.create(
            nombre='Curso escolar existente',
            precio_cuota=100.0,
            fecha_inicio=date(2022, 9, 1),
            fecha_fin=date(2023, 6, 30),
            actual=True
        )
        self.clase = Clase.objects.create(
            curso='1',
            letra='A',
            tipo_clase='INFANTIL',
            curso_escolar=self.curso_escolar
        )
        self.clase_data = {
            'curso': '2',
            'letra': 'B',
            'tipo_clase': 'PRIMARIA',
            'curso_escolar': self.curso_escolar.id
        }

    def test_get_clases(self):
        request = self.factory.get('/ampa/clases/')
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_clase(self):
        request = self.factory.post('/ampa/clases/', self.clase_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_clase_required_fields(self):
        request = self.factory.post('/ampa/clases/', {'curso': '1'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_clase_by_id_valid(self):
        request = self.factory.get(f'/ampa/clases/{self.clase.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.clase.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['curso'], 1)
        self.assertEqual(response.data[0]['letra'], 'A')

    def test_update_clase(self):
        request = self.factory.put(f'/ampa/clases/{self.clase.id}/', self.clase_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.clase.id)
        self.assertEqual(response.status_code, 200)

    def test_update_clase_invalid_id(self):
        request = self.factory.put('/ampa/clases/999/', self.clase_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_clase(self):
        request = self.factory.delete(f'/ampa/clases/{self.clase.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.clase.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_clase_invalid_id(self):
        request = self.factory.delete('/ampa/clases/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class HijoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = HijoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Joe', last_name='Doe', email='test@ejemplo.com', password='doejohn321'), tel='987654321', dni='15412769D', address='Dirección de socio')
        self.curso_escolar = CursoEscolar.objects.create(
            nombre='Curso escolar existente',
            precio_cuota=100.0,
            fecha_inicio=date(2022, 9, 1),
            fecha_fin=date(2023, 6, 30),
            actual=True
        )
        self.clase = Clase.objects.create(
            curso='1',
            letra='A',
            tipo_clase='INFANTIL',
            curso_escolar=self.curso_escolar
        )
        self.hijo = Hijo.objects.create(
            nombre='Nombre existente',
            apellidos='Apellidos existentes',
            fecha_nacimiento=date(2010, 1, 1),
            socio=self.socio,
            clase=self.clase
        )
        self.hijo_data = {
            'nombre': 'Nombre de prueba',
            'apellidos': 'Apellidos de prueba',
            'fecha_nacimiento': '2005-01-01',
            'socio': self.socio.id,
            'clase': self.clase.id
        }

    def test_get_hijos(self):
        request = self.factory.get('/ampa/hijos/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_hijo(self):
        request = self.factory.post('/ampa/hijos/', self.hijo_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_hijo_required_fields(self):
        request = self.factory.post('/ampa/hijos/', {'nombre': 'Nombre sin apellidos'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_hijo_by_id_valid(self):
        request = self.factory.get(f'/ampa/hijos/{self.hijo.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.hijo.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['nombre'], 'Nombre existente')
        self.assertEqual(response.data[0]['apellidos'], self.hijo.apellidos)

    def test_update_hijo(self):
        request = self.factory.put(f'/ampa/hijos/{self.hijo.id}/', self.hijo_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.hijo.id)
        self.assertEqual(response.status_code, 200)

    def test_update_hijo_invalid_id(self):
        request = self.factory.put('/ampa/hijos/999/', self.hijo_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_hijo(self):
        request = self.factory.delete(f'/ampa/hijos/{self.hijo.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.hijo.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_hijo_invalid_id(self):
        request = self.factory.delete('/ampa/hijos/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)
        
class AsuntoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = AsuntoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.asunto = Asunto.objects.create(
            nombre='Asunto de prueba',
            fecha_inicio=date.today(),
            fecha_fin=date(2023, 12, 31),
            hora_inicio=time(9, 0),
            hora_fin=time(10, 0),
            minutos_frecuencia=30,
            dias_semana='LUNES,MARTES,MIERCOLES',
            visible=True
        )
        self.asunto_data = {
            'nombre': 'Nuevo asunto',
            'fecha_inicio': date(2023, 6, 1),
            'fecha_fin': date(2023, 12, 31),
            'hora_inicio': time(14, 0),
            'hora_fin': time(17, 0),
            'minutos_frecuencia': 30,
            'dias_semana': 'LUNES,MARTES,MIERCOLES',
            'visible': True
        }

    def test_get_asuntos(self):
        request = self.factory.get('/ampa/asuntos/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_asunto(self):
        request = self.factory.post('/ampa/asuntos/', self.asunto_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_asunto_required_fields(self):
        request = self.factory.post('/ampa/asuntos/', {'nombre': 'Nuevo asunto'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_asunto_by_id_valid(self):
        request = self.factory.get(f'/ampa/asuntos/{self.asunto.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.asunto.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['nombre'], self.asunto.nombre)

    def test_update_asunto(self):
        request = self.factory.put(f'/ampa/asuntos/{self.asunto.id}/', self.asunto_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.asunto.id)
        self.assertEqual(response.status_code, 200)

    def test_update_asunto_invalid_id(self):
        request = self.factory.put('/ampa/asuntos/999/', self.asunto_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_asunto(self):
        request = self.factory.delete(f'/ampa/asuntos/{self.asunto.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.asunto.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_asunto_invalid_id(self):
        request = self.factory.delete('/ampa/asuntos/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class CitaViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = CitaViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Joe', last_name='Doe', email='test@ejemplo.com', password='doejohn321'), tel='987654321', dni='15412769D', address='Dirección de socio')
        self.asunto = Asunto.objects.create(
            nombre='Asunto de prueba',
            fecha_inicio=date.today(),
            fecha_fin=date(2023, 12, 31),
            hora_inicio=time(9, 0),
            hora_fin=time(10, 0),
            minutos_frecuencia=30,
            dias_semana='LUNES,MARTES,MIERCOLES',
            visible=True
        )
        self.cita = Cita.objects.create(
            fecha=date.today(),
            hora=time(9, 30),
            socio=self.socio,
            asunto=self.asunto
        )
        self.cita_data = {
            'fecha': date(2023, 10, 10),
            'hora': time(9, 0),
            'socio': self.socio.id,
            'asunto': self.asunto.id
        }

    def test_get_citas(self):
        request = self.factory.get('/ampa/citas/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_cita(self):
        request = self.factory.post('/ampa/citas/', self.cita_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_cita_required_fields(self):
        request = self.factory.post('/ampa/citas/', {'fecha': date.today(), 'hora': datetime.now().time()})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_cita_by_id_valid(self):
        request = self.factory.get(f'/ampa/citas/{self.cita.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.cita.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['fecha'], str(date.today()))
        self.assertEqual(response.data[0]['hora'], str(time(9, 30)))
        self.assertEqual(response.data[0]['socio'], self.socio.id)
        self.assertEqual(response.data[0]['asunto'], self.asunto.id)

    def test_update_cita(self):
        request = self.factory.put(f'/ampa/citas/{self.cita.id}/', self.cita_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.cita.id)
        self.assertEqual(response.status_code, 200)

    def test_update_cita_invalid_id(self):
        request = self.factory.put('/ampa/citas/999/', self.cita_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_cita(self):
        request = self.factory.delete(f'/ampa/citas/{self.cita.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.cita.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_cita_invalid_id(self):
        request = self.factory.delete('/ampa/citas/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class PagoCursoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = PagoCursoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Joe', last_name='Doe', email='test@ejemplo.com', password='doejohn321'), tel='987654321', dni='15412769D', address='Dirección de socio')
        self.curso_escolar = CursoEscolar.objects.create(
            nombre='Curso escolar existente',
            precio_cuota=100.0,
            fecha_inicio=date(2022, 9, 1),
            fecha_fin=date(2023, 6, 30),
            actual=True
        )
        self.pago_curso = PagoCurso.objects.create(
            cantidad=100.0, 
            estado=EstadoPago.RECHAZADO, 
            socio=self.socio, 
            curso_escolar=self.curso_escolar
        )
        self.pago_curso_data = {
            'cantidad': 100.0,
            'estado': EstadoPago.PENDIENTE,
            'socio': self.socio.id,
            'curso_escolar': self.curso_escolar.id
        }

    def test_get_pagos_curso(self):
        request = self.factory.get('/ampa/pagos_curso/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_pago_curso(self):
        request = self.factory.post('/ampa/pagos_curso/', self.pago_curso_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_pago_curso_required_fields(self):
        request = self.factory.post('/ampa/pagos_curso/', {'cantidad': 100})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_pago_curso_by_id_valid(self):
        request = self.factory.get(f'/ampa/pagos_curso/{self.pago_curso.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.pago_curso.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['cantidad'], 100)
        self.assertEqual(response.data[0]['socio'], self.socio.id)

    def test_update_pago_curso(self):
        request = self.factory.put(f'/ampa/pagos_curso/{self.pago_curso.id}/', self.pago_curso_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.pago_curso.id)
        self.assertEqual(response.status_code, 200)

    def test_update_pago_curso_invalid_id(self):
        request = self.factory.put('/ampa/pagos_curso/999/', self.pago_curso_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_pago_curso(self):
        request = self.factory.delete(f'/ampa/pagos_curso/{self.pago_curso.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.pago_curso.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_pago_curso_invalid_id(self):
        request = self.factory.delete('/ampa/pagos_curso/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)
