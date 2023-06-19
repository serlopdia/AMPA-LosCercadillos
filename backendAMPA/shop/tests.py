from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIRequestFactory, force_authenticate
from .models import *
from .serializer import *
from .api import *
from .views import *

# Create your tests here.
class ProductoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = ProductoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.producto = Producto.objects.create(
            nombre='Producto existente',
            descripcion='Descripción existente',
            precio_general=10.0,
            precio_socio=5.0,
            imagen='imagen.jpg'
        )
        self.producto_data = {
            'nombre': 'Nombre de prueba',
            'descripcion': 'Descripción de prueba',
            'precio_general': 20.0,
            'precio_socio': 10.0,
            'imagen': 'imagen_prueba.jpg'
        }

    def test_get_productos(self):
        request = self.factory.get('/ampa/productos/')
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_producto(self):
        request = self.factory.post('/ampa/productos/', self.producto_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_producto_required_fields(self):
        request = self.factory.post('/ampa/productos/', {'nombre': 'Nombre sin descripción'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_producto_by_id_valid(self):
        request = self.factory.get(f'/ampa/productos/{self.producto.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.producto.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['nombre'], 'Producto existente')
        self.assertEqual(response.data[0]['precio_general'], self.producto.precio_general)

    def test_update_producto(self):
        request = self.factory.put(f'/ampa/productos/{self.producto.id}/', self.producto_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.producto.id)
        self.assertEqual(response.status_code, 200)

    def test_update_producto_invalid_id(self):
        request = self.factory.put('/ampa/productos/999/', self.producto_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_producto(self):
        request = self.factory.delete(f'/ampa/productos/{self.producto.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.producto.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_producto_invalid_id(self):
        request = self.factory.delete('/ampa/productos/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class PagoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = PagoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.pago = Pago.objects.create(
            nombre='Nombre existente', 
            email='correo@test.com', 
            telefono='123456789', 
            estado='PENDIENTE', 
            cantidad=10,
        )
        self.pago_data = {
            'nombre': 'Nuevo Nombre', 
            'email': 'nuevo_correo@test.com', 
            'telefono': '987654321', 
            'estado': 'PAGADO', 
            'cantidad': 20,
        }

    def test_get_pagos(self):
        request = self.factory.get('/ampa/pagos/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_pago(self):
        request = self.factory.post('/ampa/pagos/', self.pago_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_pago_required_fields(self):
        request = self.factory.post('/ampa/pagos/', {'nombre': 'Nombre sin email'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_pago_by_id_valid(self):
        request = self.factory.get(f'/ampa/pagos/{self.pago.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.pago.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['nombre'], 'Nombre existente')
        self.assertEqual(response.data[0]['email'], self.pago.email)

    def test_update_pago(self):
        request = self.factory.put(f'/ampa/pagos/{self.pago.id}/', self.pago_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.pago.id)
        self.assertEqual(response.status_code, 200)

    def test_update_pago_invalid_id(self):
        request = self.factory.put('/ampa/pagos/999/', self.pago_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_pago(self):
        request = self.factory.delete(f'/ampa/pagos/{self.pago.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.pago.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_pago_invalid_id(self):
        request = self.factory.delete('/ampa/pagos/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class PedidoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = PedidoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Joe', last_name='Doe', email='test@ejemplo.com', password='doejohn321'), tel='987654321', dni='15412769D', address='Dirección de socio')
        self.pago1 = Pago.objects.create(
            nombre='Nombre existente', 
            email='correo@test.com', 
            telefono='123456789', 
            estado='PAGADO', 
            cantidad=10,
        )
        self.pago2 = Pago.objects.create(
            nombre='Nombre existente', 
            email='correo@test.com', 
            telefono='123456789', 
            estado='PAGADO', 
            cantidad=10,
        )
        self.pedido = Pedido.objects.create(
            nombre='Nombre existente', 
            email='test@example.com', 
            telefono='123456789', 
            estado='ENTREGADO', 
            observaciones='Observaciones existentes', 
            pago=self.pago1, 
            socio=self.socio
        )
        self.pedido_data = {
            'nombre': 'Nombre de prueba', 
            'email': 'test@example.com', 
            'telefono': '987654321', 
            'estado': 'PREPARACION', 
            'observaciones': 'Observaciones de prueba', 
            'pago': self.pago2.id, 
        }

    def test_get_pedidos(self):
        request = self.factory.get('/ampa/pedidos/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_pedido(self):
        request = self.factory.post('/ampa/pedidos/', self.pedido_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_pedido_required_fields(self):
        request = self.factory.post('/ampa/pedidos/', {'nombre': 'Nombre sin email'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_pedido_by_id_valid(self):
        request = self.factory.get(f'/ampa/pedidos/{self.pedido.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.pedido.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['nombre'], 'Nombre existente')
        self.assertEqual(response.data[0]['estado'], self.pedido.estado)

    def test_update_pedido(self):
        request = self.factory.put(f'/ampa/pedidos/{self.pedido.id}/', self.pedido_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.pedido.id)
        self.assertEqual(response.status_code, 200)

    def test_update_pedido_invalid_id(self):
        request = self.factory.put('/ampa/pedidos/999/', self.pedido_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_pedido(self):
        request = self.factory.delete(f'/ampa/pedidos/{self.pedido.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.pedido.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_pedido_invalid_id(self):
        request = self.factory.delete('/ampa/pedidos/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class StockProductoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = StockProductoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.producto = Producto.objects.create(
            nombre='Producto existente',
            descripcion='Descripción existente',
            precio_general=10.0,
            precio_socio=5.0,
            imagen='imagen.jpg'
        )
        self.stock_producto = StockProducto.objects.create(
            nombre='Stock 1', 
            cantidad=10,
            producto= self.producto
        )
        self.stock_producto_data = {
            'nombre': 'Nuevo stock',
            'cantidad': 5,
            'producto': self.producto.id
        }

    def test_get_stock_productos(self):
        request = self.factory.get('/ampa/stock-productos/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_stock_producto(self):
        request = self.factory.post('/ampa/stock-productos/', self.stock_producto_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_stock_producto_required_fields(self):
        request = self.factory.post('/ampa/stock-productos/', {})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_stock_producto_by_id_valid(self):
        request = self.factory.get(f'/ampa/stock-productos/{self.stock_producto.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.stock_producto.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['nombre'], 'Stock 1')
        self.assertEqual(response.data[0]['cantidad'], self.stock_producto.cantidad)

    def test_update_stock_producto(self):
        request = self.factory.put(f'/ampa/stock-productos/{self.stock_producto.id}/', self.stock_producto_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.stock_producto.id)
        self.assertEqual(response.status_code, 200)

    def test_update_stock_producto_invalid_id(self):
        request = self.factory.put('/ampa/stock-productos/999/', self.stock_producto_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_stock_producto(self):
        request = self.factory.delete(f'/ampa/stock-productos/{self.stock_producto.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.stock_producto.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_stock_producto_invalid_id(self):
        request = self.factory.delete('/ampa/stock-productos/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

class LineaPedidoViewSetTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = LineaPedidoViewSet.as_view({'get': 'list', 'post': 'create', 'put': 'update', 'delete': 'destroy'})
        self.user = User.objects.create_user(username='admintest', password='admintest')
        self.user.is_staff = True
        self.socio = Socio.objects.create(user=User.objects.create(username='newusersocio', first_name='Joe', last_name='Doe', email='test@ejemplo.com', password='doejohn321'), tel='987654321', dni='15412769D', address='Dirección de socio')
        self.pago1 = Pago.objects.create(
            nombre='Nombre existente', 
            email='correo@test.com', 
            telefono='123456789', 
            estado='PAGADO', 
            cantidad=10,
        )
        self.pedido = Pedido.objects.create(
            nombre='Nombre existente', 
            email='test@example.com', 
            telefono='123456789', 
            estado='ENTREGADO', 
            observaciones='Observaciones existentes', 
            pago=self.pago1, 
            socio=self.socio
        )
        self.producto = Producto.objects.create(
            nombre='Producto existente',
            descripcion='Descripción existente',
            precio_general=10.0,
            precio_socio=5.0,
            imagen='imagen.jpg'
        )
        self.stock_producto = StockProducto.objects.create(
            nombre='Stock 1', 
            cantidad=10,
            producto= self.producto
        )
        self.linea_pedido = LineaPedido.objects.create(
            producto=self.producto,
            stock=self.stock_producto,
            cantidad=5,
            pedido=self.pedido
        )
        self.linea_pedido_data = {
            'producto': self.producto.id,
            'stock': self.stock_producto.id,
            'cantidad': 3,
            'pedido': self.pedido.id
        }

    def test_get_lineas_pedido(self):
        request = self.factory.get('/ampa/lineas-pedido/')
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 200)

    def test_create_linea_pedido(self):
        request = self.factory.post('/ampa/lineas-pedido/', self.linea_pedido_data)
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 201)

    def test_create_linea_pedido_required_fields(self):
        request = self.factory.post('/ampa/lineas-pedido/', {'producto': 'Producto sin stock'})
        force_authenticate(request, user=self.user)
        response = self.view(request)
        self.assertEqual(response.status_code, 400)

    def test_get_linea_pedido_by_id_valid(self):
        request = self.factory.get(f'/ampa/lineas-pedido/{self.linea_pedido.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.linea_pedido.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['producto'], self.linea_pedido.producto.id)
        self.assertEqual(response.data[0]['pedido'], self.linea_pedido.pedido.id)

    def test_update_linea_pedido(self):
        request = self.factory.put(f'/ampa/lineas-pedido/{self.linea_pedido.id}/', self.linea_pedido_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.linea_pedido.id)
        self.assertEqual(response.status_code, 200)

    def test_update_linea_pedido_invalid_id(self):
        request = self.factory.put('/ampa/lineas-pedido/999/', self.linea_pedido_data)
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)

    def test_delete_linea_pedido(self):
        request = self.factory.delete(f'/ampa/lineas-pedido/{self.linea_pedido.id}/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=self.linea_pedido.id)
        self.assertEqual(response.status_code, 204)

    def test_delete_linea_pedido_invalid_id(self):
        request = self.factory.delete('/ampa/lineas-pedido/999/')
        force_authenticate(request, user=self.user)
        response = self.view(request, pk=999)
        self.assertEqual(response.status_code, 404)
