import json
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
        self.wrong_vista_data1 = {'tipo': 'RECREO', 'markdown': 'Markdown de prueba'}
        self.wrong_vista_data2 = {'tipo': 'DIRECCION', 'markdown': ''}

    def test_get_vistas(self):
        request = self.factory.get('/ampa/vistas/')
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_vista(self):
        request = self.factory.post('/ampa/vistas/', self.vista_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_vista_wrong_fields(self):
        request = self.factory.post('/ampa/vistas/', self.wrong_vista_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_vista_by_id(self):
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

    def test_update_vista_wrong_fields(self):
        request = self.factory.put(f'/ampa/vistas/{self.vista.id}/', self.wrong_vista_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.vista.id)
        self.assertEqual(response.status_code, 400)

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
        self.wrong_noticia_data1 = {'titulo': '', 'cuerpo': 'Cuerpo de prueba'}
        self.wrong_noticia_data2 = {'titulo': 'Título de prueba', 'cuerpo': ''}

    def test_get_noticias(self):
        request = self.factory.get('/ampa/noticias/')
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_noticia(self):
        request = self.factory.post('/ampa/noticias/', self.noticia_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_noticia_wrong_fields(self):
        request = self.factory.post('/ampa/noticias/', self.wrong_noticia_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_noticia_by_id(self):
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

    def test_update_noticia_wrong_fields(self):
        request = self.factory.put(f'/ampa/noticias/{self.noticia.id}/', self.wrong_noticia_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.noticia.id)
        self.assertEqual(response.status_code, 400)

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
            'fin_inscripcion': datetime.now(timezone.utc) + timedelta(days=7),
            'socios': [self.socio1.id, self.socio2.id]
        }
        self.wrong_evento_data1 = {
            'titulo': 'Título de prueba',
            'descripcion': 'Descripción de prueba',
            'capacidad': 50,
            'fin_inscripcion': datetime.now(timezone.utc) - timedelta(days=7),
            'socios': [self.socio1.id, self.socio2.id]
        }
        self.wrong_evento_data2 = {
            'titulo': '',
            'descripcion': '',
            'capacidad': 50,
            'fin_inscripcion': datetime.now(timezone.utc) + timedelta(days=7),
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

    def test_create_evento_wrong_fields(self):
        request = self.factory.post('/ampa/eventos/', self.wrong_evento_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_evento_by_id(self):
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

    def test_update_evento_wrong_data(self):
        request = self.factory.put(f'/ampa/eventos/{self.evento.id}/', self.wrong_evento_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.evento.id)
        self.assertEqual(response.status_code, 400)

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
        self.wrong_colaborador_data1 = {
            'nombre': '',
            'ventaja': 'Ventaja de prueba',
            'descripcion': 'Descripción de prueba',
            'imagen': 'imagen.jpg'
        }
        self.wrong_colaborador_data2 = {
            'nombre': 'Nombre de prueba',
            'ventaja': 'Ventaja de prueba',
            'descripcion': '',
            'imagen': ''
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

    def test_create_colaborador_wrong_fields(self):
        request = self.factory.post('/ampa/colaboradores/', self.wrong_colaborador_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_colaborador_by_id(self):
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

    def test_update_colaborador_wrong_fields(self):
        request = self.factory.put(f'/ampa/colaboradores/{self.colaborador.id}/', self.wrong_colaborador_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.colaborador.id)
        self.assertEqual(response.status_code, 400)

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
        self.wrong_sugerencia_data1 = {
            'nombre': 'Nombre de prueba',
            'email': '65ujh€#2jdnf',
            'titulo': 'Título de prueba',
            'descripcion': 'Descripción de prueba'
        }
        self.wrong_sugerencia_data2 = {
            'nombre': '',
            'email': 'test@example.com',
            'titulo': '',
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

    def test_create_sugerencia_wrong_fields(self):
        request = self.factory.post('/ampa/sugerencias/', self.wrong_sugerencia_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_sugerencia_by_id(self):
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

    def test_update_sugerencia_wrong_fields(self):
        request = self.factory.put(f'/ampa/sugerencias/{self.sugerencia.id}/', self.wrong_sugerencia_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.sugerencia.id)
        self.assertEqual(response.status_code, 400)

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
        self.wrong_balance_data1 = {
            'tipo': 'INGRESO',
            'asunto': 'Asunto de prueba',
            'cantidad': -20
        }
        self.wrong_balance_data2 = {
            'tipo': 'NADA',
            'asunto': '',
            'cantidad': 3.678
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

    def test_create_balance_wrong_fields(self):
        request = self.factory.post('/ampa/balances/', self.wrong_balance_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_balance_by_id(self):
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

    def test_update_balance_wrong_fields(self):
        request = self.factory.put(f'/ampa/balances/{self.balance.id}/', self.wrong_balance_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.balance.id)
        self.assertEqual(response.status_code, 400)

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
        self.wrong_curso_escolar_data1 = {
            'nombre': 'Curso escolar de prueba',
            'precio_cuota': 200.0,
            'fecha_inicio': date(2024, 6, 30),
            'fecha_fin': date(2023, 9, 1),
            'actual': False
        }
        self.wrong_curso_escolar_data2 = {
            'nombre': '',
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

    def test_create_curso_escolar_wrong_fields(self):
        request = self.factory.post('/ampa/cursos-escolares/', self.wrong_curso_escolar_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_curso_escolar_by_id(self):
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

    def test_update_curso_escolar_wrong_fields(self):
        request = self.factory.put(f'/ampa/cursos-escolares/{self.curso_escolar.id}/', self.wrong_curso_escolar_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.curso_escolar.id)
        self.assertEqual(response.status_code, 400)

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
        self.wrong_clase_data1 = {
            'curso': '2',
            'letra': 'B',
            'tipo_clase': 'ESO',
            'curso_escolar': self.curso_escolar.id
        }
        self.wrong_clase_data2 = {
            'curso': '1',
            'letra': 'A',
            'tipo_clase': 'INFANTIL',
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

    def test_create_clase_wrong_fields(self):
        request = self.factory.post('/ampa/clases/', self.wrong_clase_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_clase_by_id(self):
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

    def test_update_clase_wrong_fields(self):
        request = self.factory.put(f'/ampa/clases/{self.clase.id}/', self.wrong_clase_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.clase.id)
        self.assertEqual(response.status_code, 400)

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
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Juan', last_name='Sánchez', email='juan@correo.com', password='juansan321'), tel='987654321', dni='15412769D', address='Dirección de socio')
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
        self.wrong_hijo_data1 = {
            'nombre': 'Nombre de prueba',
            'apellidos': 'Apellidos de prueba',
            'fecha_nacimiento': '2065-01-01',
            'socio': self.socio.id,
            'clase': self.clase.id
        }
        self.wrong_hijo_data2 = {
            'nombre': 'Nombre de prueba',
            'apellidos': '',
            'fecha_nacimiento': '2005-01-01',
            'socio': 'ninguno',
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

    def test_create_hijo_wrong_fields(self):
        request = self.factory.post('/ampa/hijos/', self.wrong_hijo_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_hijo_by_id(self):
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

    def test_update_hijo_wrong_fields(self):
        request = self.factory.put(f'/ampa/hijos/{self.hijo.id}/', self.wrong_hijo_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.hijo.id)
        self.assertEqual(response.status_code, 400)

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
        self.wrong_asunto_data1 = {
            'nombre': 'Nuevo asunto',
            'fecha_inicio': date(2023, 6, 1),
            'fecha_fin': date(2023, 12, 31),
            'hora_inicio': time(14, 0),
            'hora_fin': time(17, 0),
            'minutos_frecuencia': 17,
            'dias_semana': 'DOMINGO',
            'visible': True
        }
        self.wrong_asunto_data2 = {
            'nombre': 'Nuevo asunto',
            'fecha_inicio': date(2023, 12, 31),
            'fecha_fin': date(2023, 6, 1),
            'hora_inicio': time(14, 0),
            'hora_fin': time(17, 0),
            'minutos_frecuencia': 30,
            'dias_semana': '',
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

    def test_create_asunto_wrong_fields(self):
        request = self.factory.post('/ampa/asuntos/', self.wrong_asunto_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_asunto_by_id(self):
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

    def test_update_asunto_wrong_fields(self):
        request = self.factory.put(f'/ampa/asuntos/{self.asunto.id}/', self.wrong_asunto_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.asunto.id)
        self.assertEqual(response.status_code, 400)

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
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Juan', last_name='Sánchez', email='juan@correo.com', password='juansan321'), tel='987654321', dni='15412769D', address='Dirección de socio')
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
            fecha=date(2023, 9, 20),
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
        self.wrong_cita_data1 = {
            'fecha': date(2023, 9, 20),
            'hora': time(9, 30),
            'socio': self.socio.id,
            'asunto': self.asunto.id
        }
        self.wrong_cita_data2 = {
            'fecha': date(2021, 10, 10),
            'hora': time(9, 19),
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

    def test_create_cita_wrong_fields(self):
        request = self.factory.post('/ampa/citas/', self.wrong_cita_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_cita_by_id(self):
        request = self.factory.get(f'/ampa/citas/{self.cita.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.cita.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['fecha'], str(date(2023, 9, 20)))
        self.assertEqual(response.data[0]['hora'], str(time(9, 30)))
        self.assertEqual(response.data[0]['socio'], self.socio.id)
        self.assertEqual(response.data[0]['asunto'], self.asunto.id)

    def test_update_cita(self):
        request = self.factory.put(f'/ampa/citas/{self.cita.id}/', self.cita_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.cita.id)
        self.assertEqual(response.status_code, 200)

    def test_update_cita_wrong_fields(self):
        request = self.factory.put(f'/ampa/citas/{self.cita.id}/', self.wrong_cita_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.cita.id)
        self.assertEqual(response.status_code, 400)

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
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Juan', last_name='Sánchez', email='juan@correo.com', password='juansan321'), tel='987654321', dni='15412769D', address='Dirección de socio')
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
        self.wrong_pago_curso_data1 = {
            'cantidad': 100.0,
            'estado': 'ENMANO',
            'socio': self.socio.id,
            'curso_escolar': self.curso_escolar.id
        }
        self.wrong_pago_curso_data2 = {
            'cantidad': 100.0,
            'estado': '',
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

    def test_create_pago_curso_wrong_fields(self):
        request = self.factory.post('/ampa/pagos_curso/', self.wrong_pago_curso_data1)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_pago_curso_by_id(self):
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

    def test_update_pago_curso_wrong_fields(self):
        request = self.factory.put(f'/ampa/pagos_curso/{self.pago_curso.id}/', self.wrong_pago_curso_data2)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.pago_curso.id)
        self.assertEqual(response.status_code, 400)

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

# TESTS DE LAS FUNCIONES Y CLASES DE VIEWS.PY
class EventoSubAPITestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Juan', last_name='Sánchez', email='juan@correo.com', password='juansan321'), tel='987654321', dni='15412769D', address='Dirección de socio')
        self.curso_escolar = CursoEscolar.objects.create(
            nombre='Curso escolar existente',
            precio_cuota=100.0,
            fecha_inicio=date(2022, 9, 1),
            fecha_fin=date(2023, 6, 30),
            actual=True
        )
        self.pago_curso = PagoCurso.objects.create(
            cantidad=100.0, 
            estado=EstadoPago.PAGADO, 
            socio=self.socio, 
            curso_escolar=self.curso_escolar
        )
        self.evento = Evento.objects.create(
            titulo='Evento existente',
            descripcion='Descripción existente',
            capacidad=100,
            fin_inscripcion=datetime.now(timezone.utc) + timedelta(days=7),
            visible=True
        )

    def test_join_evento(self):
        url = f'/ampa/eventos/{self.evento.pk}/join/'
        request = self.factory.post(url)
        force_authenticate(request, user=self.socio.user)

        response = JoinEventoView.as_view()(request, pk=self.evento.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {'status': 'El socio se ha apuntado correctamente al evento'}
        )
        self.assertTrue(self.socio in self.evento.socios.all())

    def test_leave_evento(self):
        self.evento.socios.add(self.socio)

        url = f'/ampa/eventos/{self.evento.pk}/leave/'
        request = self.factory.post(url)
        force_authenticate(request, user=self.socio.user)

        response = LeaveEventoView.as_view()(request, pk=self.evento.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.data,
            {'status': 'El socio ha sido eliminado correctamente del evento'}
        )
        self.assertTrue(self.socio not in self.evento.socios.all())

class CitasListAPITestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Juan', last_name='Sánchez', email='juan@correo.com', password='juansan321'), tel='987654321', dni='15412769D', address='Dirección de socio')
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
        self.cita1 = Cita.objects.create(
            fecha=date(2023, 9, 20),
            hora=time(9, 30),
            socio=self.socio,
            asunto=self.asunto
        )
        self.cita2 = Cita.objects.create(
            fecha=date(2023, 9, 18),
            hora=time(9, 0),
            socio=self.socio,
            asunto=self.asunto
        )

    def test_citas_socio_list(self):
        url = f'/ampa/citas/socio/{self.socio.pk}/'
        request = self.factory.get(url)
        force_authenticate(request, user=self.socio.user)

        response = CitasSocioList.as_view()(request, pk=self.socio.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

class HijosListAPITestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Juan', last_name='Sánchez', email='juan@correo.com', password='juansan321'), tel='987654321', dni='15412769D', address='Dirección de socio')
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
        self.hijo1 = Hijo.objects.create(
            nombre='Nombre existente',
            apellidos='Apellidos existentes',
            fecha_nacimiento=date(2010, 1, 1),
            socio=self.socio,
            clase=self.clase
        )
        self.hijo2 = Hijo.objects.create(
            nombre='Nombre',
            apellidos='Segundo hijo',
            fecha_nacimiento=date(2015, 5, 12),
            socio=self.socio,
            clase=self.clase
        )

    def test_hijos_socio_list(self):
        url = f'/ampa/hijos/socio/{self.socio.pk}/'
        request = self.factory.get(url)
        force_authenticate(request, user=self.socio.user)

        response = HijosSocioList.as_view()(request, pk=self.socio.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

class PagosCursoListAPITestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Juan', last_name='Sánchez', email='juan@correo.com', password='juansan321'), tel='987654321', dni='15412769D', address='Dirección de socio')
        self.curso_escolar = CursoEscolar.objects.create(
            nombre='Curso escolar existente',
            precio_cuota=100.0,
            fecha_inicio=date(2022, 9, 1),
            fecha_fin=date(2024, 6, 30),
            actual=True
        )
        self.pago_curso1 = PagoCurso.objects.create(
            cantidad=100.0, 
            estado=EstadoPago.RECHAZADO, 
            socio=self.socio, 
            curso_escolar=self.curso_escolar
        )
        self.pago_curso2 = PagoCurso.objects.create(
            cantidad=100.0, 
            estado=EstadoPago.PAGADO, 
            socio=self.socio, 
            curso_escolar=self.curso_escolar
        )

    def test_pagos_curso_socio_list(self):
        url = f'/ampa/pagos_curso/socio/{self.socio.pk}/'
        request = self.factory.get(url)
        force_authenticate(request, user=self.socio.user)

        response = PagosCursoSocioList.as_view()(request, pk=self.socio.pk)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

class AsuntoDisponibilidadAPITestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Juan', last_name='Sánchez', email='juan@correo.com', password='juansan321'), tel='987654321', dni='15412769D', address='Dirección de socio')
        self.curso_escolar = CursoEscolar.objects.create(
            nombre='Curso escolar existente',
            precio_cuota=100.0,
            fecha_inicio=date(2022, 9, 1),
            fecha_fin=date(2024, 6, 30),
            actual=True
        )
        self.pago_curso = PagoCurso.objects.create(
            cantidad=100.0, 
            estado=EstadoPago.PAGADO, 
            socio=self.socio, 
            curso_escolar=self.curso_escolar
        )
        self.asunto = Asunto.objects.create(
            nombre='Asunto de prueba',
            fecha_inicio=date.today(),
            fecha_fin=date(2023, 12, 31),
            hora_inicio=time(9, 0),
            hora_fin=time(10, 0),
            minutos_frecuencia=15,
            dias_semana='LUNES,MARTES,MIERCOLES',
            visible=True
        )
        self.cita = Cita.objects.create(
            fecha=date(2023, 9, 20),
            hora=time(9, 15),
            socio=self.socio,
            asunto=self.asunto
        )
        self.data = {'asunto_id': self.asunto.id, 'fecha': '2023-09-20'}

    def test_asunto_disponibilidad_dia(self):
        url = f'/ampa/disponibilidad_asunto/'
        request = self.factory.post(url, self.data)
        force_authenticate(request, user=self.socio.user)

        view = AsuntoDisponibilidadDia.as_view()
        response = view(request)

        self.assertEqual(response.status_code, 200)
        self.assertListEqual(response.data, ['09:00', '09:30', '09:45', '10:00'])

class CuotaCheckoutAPITestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Juan', last_name='Sánchez', email='juan@correo.com', password='juansan321'), tel='987654321', dni='15412769D', address='Dirección de socio')
        self.curso_escolar = CursoEscolar.objects.create(
            nombre='Curso escolar existente',
            precio_cuota=15.5,
            fecha_inicio=date(2022, 9, 1),
            fecha_fin=date(2024, 6, 30),
            actual=True
        )
        self.data = {
            'price': 15.5,
            'product_name': 'Producto de prueba',
            'idCurso': self.curso_escolar.id,
            'idSocio': self.socio.id,
            'quantity': 1,
            'successUrl': 'https://example.com/success',
            'cancelUrl': 'https://example.com/cancel',
        }

    def test_create_checkout_session(self):
        view = CreateCuotaCheckoutSession.as_view()
        request = self.factory.post('/ampa/checkout_cuota/', json.dumps(self.data), content_type='application/json')
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('url', response.data)