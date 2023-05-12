from django.db import models
from django.forms import ValidationError
from django.utils.translation import gettext_lazy as _

from users.models import Socio

# Create your models here.

class EstadoPago(models.TextChoices):
    PAGADO = "PAGADO", _("Pagado"),
    PENDIENTE = "PENDIENTE", _("Pendiente"),
    RECHAZADO = "RECHAZADO", _("Rechazado"),

class EstadoPedido(models.TextChoices):
    ENTREGADO = "ENTREGADO", _("Entregado"),
    PREPARACION = "PREPARACION", _("Preparación"),
    CANCELADO = "CANCELADO", _("Cancelado"),

class Producto(models.Model):
    nombre = models.CharField(max_length=64)
    descripcion = models.CharField(max_length=256)
    precio_general = models.FloatField()
    precio_socio = models.FloatField()
    imagen = models.CharField(max_length=2048)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="shop"

class Pago(models.Model):
    estado = models.CharField(choices=EstadoPago.choices, max_length=64)
    cantidad = models.FloatField()
    socio = models.ForeignKey(Socio, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="shop"

    def clean(self):
        if self.estado not in ["PAGADO", "PENDIENTE", "RECHAZADO"]:
            raise ValidationError("El valor del campo 'estado' debe ser uno de los siguientes: 'PAGADO', 'PENDIENTE', 'RECHAZADO'")

class Pedido(models.Model):
    estado = models.CharField(choices=EstadoPedido.choices, max_length=64)
    pago = models.ForeignKey(Pago, on_delete=models.SET_NULL, null=True)
    socio = models.ForeignKey(Socio, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="shop"

    def clean(self):
        if self.estado not in ["ENTREGADO", "PREPARACION", "DEVUELTO"]:
            raise ValidationError("El valor del campo 'estado' debe ser uno de los siguientes: 'ENTREGADO', 'PREPARACION', 'DEVUELTO'")

class LineaPedido(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True)
    cantidad = models.IntegerField()
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="shop"

class StockProducto(models.Model):
    nombre = models.CharField(max_length=64)
    cantidad = models.IntegerField()
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="shop"
        unique_together = ('nombre', 'producto')
