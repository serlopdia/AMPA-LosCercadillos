from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, force_authenticate
from .models import *
from .serializer import *
from .api import *
from .views import *

# Create your tests here.
class SocioViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = SocioViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Juan', last_name='Sánchez', email='juan@correo.com', password='juansan321'), tel='987654321', dni='15412769D', address='Dirección de socio')
        self.socio_data = {
            'username': 'prueba',
            'first_name': 'Test',
            'last_name': 'Doe',
            'password': 'testdoe345',
            'email': 'correo@prueba.com',
            'tel': '654373222',
            'dni': '15412769D',
            'address': 'Another address',
        }
        self.socio_updated_data = {
            'username': 'newusername',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'password': '321doejohn',
            'email': 'newemail@example.com',
            'tel': '999999999',
            'dni': '15412769D',
            'address': 'Updated address',
        }

    def test_get_socios(self):
        request = self.factory.get('/users/socios/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_socio(self):
        request = self.factory.post('/users/socios/', self.socio_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_socio_required_fields(self):
        request = self.factory.post('/users/socios/', {'last_name': 'Apellidos y faltan datos'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_socio_by_id_valid(self):
        request = self.factory.get(f'/users/socios/{self.socio.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.socio.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['username'], 'newusersocio')
        self.assertEqual(response.data[0]['tel'], self.socio.tel)

    def test_update_socio(self):
        request = self.factory.put(f'/users/socios/{self.socio.id}/', self.socio_updated_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.socio.id)
        self.assertEqual(response.status_code, 200)

    def test_update_socio_invalid_id(self):
        request_data = {
            'username': 'newusername',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'password': 'newpassword123',
            'email': 'newemail@example.com',
            'tel': '999999999',
            'dni': '98765432C',
            'address': 'Updated address',
        }
        request = self.factory.put('/users/socios/999/', request_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_socio(self):
        request = self.factory.delete(f'/users/socios/{self.socio.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.socio.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_socio_invalid_id(self):
        request = self.factory.delete('/users/socios/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class AdministradorViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = AdministradorViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.admin_data = {
            'username': 'nuevo_admin',
            'password': 'nueva_clave',
        }
    
    def test_get_administradores(self):
        request = self.factory.get('/users/administradores/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_administrador(self):
        request = self.factory.post('/users/administradores/', self.admin_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)
