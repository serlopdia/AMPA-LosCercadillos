from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import *

@receiver(post_migrate)
def create_shop(sender, **kwargs):
    if sender.name == "shop":
        socio = Socio.objects.filter(id=1).first()
        if not Producto.objects.exists():
            producto_sample_uno = Producto.objects.create(nombre="Taza", descripcion="Taza edición especial AMPA 2022/23.", precio_general=8.0, precio_socio=6.25, imagen="https://recuerdosbaby.es/wp-content/uploads/2022/08/Taza-personalizada-profesora-alumnos-recuerdosbaby-delante.jpg")
            producto_sample_uno.save()
            producto_sample_dos = Producto.objects.create(nombre="Agenda", descripcion="Agenda edición única del AMPA 2022/23.", precio_general=10.0, precio_socio=5.50, imagen="https://static.wixstatic.com/media/190bc0_d109193881d34f38bdd605884301ae99~mv2.jpg/v1/fill/w_1000,h_1000,al_c,q_85,usm_0.66_1.00_0.01/190bc0_d109193881d34f38bdd605884301ae99~mv2.jpg")
            producto_sample_dos.save()

        if not Pago.objects.exists():
            pago_sample_uno = Pago.objects.create(nombre='Sergio López Díaz', email='sergio@correo.com', telefono='601027857', estado=EstadoPago.PENDIENTE, cantidad=6.25, socio=socio)
            pago_sample_uno.save()
            pago_sample_dos = Pago.objects.create(nombre='Sergio López Díaz', email='sergio@correo.com', telefono='601027857', estado=EstadoPago.PAGADO, cantidad=31.0, socio=socio)
            pago_sample_dos.save()

        if not Pedido.objects.exists():
            pago_sample_uno = Pago.objects.get(id=1)
            pago_sample_dos = Pago.objects.get(id=2)
            pedido_sample_uno = Pedido.objects.create(nombre='Sergio López Díaz', email='sergio@correo.com', telefono='601027857', estado=EstadoPedido.PREPARACION, observaciones='', pago=pago_sample_uno, socio=socio)
            pedido_sample_uno.save()
            pedido_sample_dos = Pedido.objects.create(nombre='Sergio López Díaz', email='sergio@correo.com', telefono='601027857', estado=EstadoPedido.ENTREGADO, observaciones='La quiero de la clase de 1ºPrimaria B', pago=pago_sample_dos, socio=socio)
            pedido_sample_dos.save()

        if not LineaPedido.objects.exists():
            pedido_sample_uno = Pedido.objects.get(id=1)
            pedido_sample_dos = Pedido.objects.get(id=2)
            producto_sample_uno = Producto.objects.get(id=1)
            producto_sample_dos = Producto.objects.get(id=2)
            linea_pedido_sample_uno = LineaPedido.objects.create(producto=producto_sample_uno, cantidad=1, pedido=pedido_sample_uno)
            linea_pedido_sample_uno.save()
            linea_pedido_sample_dos = LineaPedido.objects.create(producto=producto_sample_dos, cantidad=2, pedido=pedido_sample_dos)
            linea_pedido_sample_dos.save()

        if not StockProducto.objects.exists():
            producto_sample_uno = Producto.objects.get(id=1)
            producto_sample_dos = Producto.objects.get(id=2)
            stock_producto_sample_uno = StockProducto.objects.create(nombre="Taza de 1ºB", cantidad=9, producto=producto_sample_uno)
            stock_producto_sample_uno.save()
            stock_producto_sample_dos = StockProducto.objects.create(nombre="Taza de 2ºA", cantidad=7, producto=producto_sample_uno)
            stock_producto_sample_dos.save()
            stock_producto_sample_tres = StockProducto.objects.create(nombre="Edición única", cantidad=25, producto=producto_sample_dos)
            stock_producto_sample_tres.save()
