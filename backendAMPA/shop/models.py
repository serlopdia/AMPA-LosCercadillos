from django.db import models
from django.forms import ValidationError
from django.utils.translation import gettext_lazy as _
import re

from users.models import Socio

# Create your models here.

class EstadoPago(models.TextChoices):
    PAGADO = "PAGADO", _("Pagado"),
    PENDIENTE = "PENDIENTE", _("Pendiente"),
    RECHAZADO = "RECHAZADO", _("Rechazado"),

class EstadoPedido(models.TextChoices):
    ENTREGADO = "ENTREGADO", _("Entregado"),
    PREPARACION = "PREPARACION", _("Preparación"),
    DEVUELTO = "DEVUELTO", _("Devuelto"),
    CANCELADO = "CANCELADO", _("Cancelado"),
    NO_PAGADO = "NO_PAGADO", _("No pagado"),

class Producto(models.Model):
    nombre = models.CharField(max_length=64)
    descripcion = models.CharField(max_length=1024)
    precio_general = models.FloatField()
    precio_socio = models.FloatField()
    imagen = models.CharField(max_length=2048)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="shop"

class Pago(models.Model):
    nombre = models.CharField(max_length=128)
    email = models.CharField(max_length=128)
    telefono = models.CharField(max_length=20)
    estado = models.CharField(choices=EstadoPago.choices, max_length=64)
    cantidad = models.FloatField()
    socio = models.ForeignKey(Socio, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "shop"

    def clean(self):
        if self.estado not in ["PAGADO", "PENDIENTE", "RECHAZADO"]:
            raise ValidationError("El valor del campo 'estado' debe ser uno de los siguientes: 'PAGADO', 'PENDIENTE', 'RECHAZADO'")
        
        if len(self.telefono) != 9:
            raise ValidationError("El número de teléfono debe tener 9 dígitos.")

        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', self.email):
            raise ValidationError("El correo electrónico no tiene un formato válido.")

        if self.cantidad < 0:
            raise ValidationError("La cantidad debe ser un número positivo o igual a 0.")

class Pedido(models.Model):
    nombre = models.CharField(max_length=128)
    email = models.CharField(max_length=128)
    telefono = models.CharField(max_length=20)
    estado = models.CharField(choices=EstadoPedido.choices, max_length=64)
    observaciones = models.CharField(max_length=512, null=True, blank=True)
    pago = models.ForeignKey(Pago, on_delete=models.SET_NULL, null=True)
    socio = models.ForeignKey(Socio, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "shop"

    def clean(self):
        if self.estado not in ["ENTREGADO", "PREPARACION", "DEVUELTO", "CANCELADO", "NO_PAGADO"]:
            raise ValidationError("El valor del campo 'estado' debe ser uno de los siguientes: 'ENTREGADO', 'PREPARACION', 'DEVUELTO', 'CANCELADO', 'NO_PAGADO'")
        
        if len(self.telefono) != 9:
            raise ValidationError("El número de teléfono debe tener 9 dígitos.")

        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', self.email):
            raise ValidationError("El correo electrónico no tiene un formato válido.")
        
class StockProducto(models.Model):
    nombre = models.CharField(max_length=64)
    cantidad = models.IntegerField()
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "shop"
        unique_together = ('nombre', 'producto')

    def clean(self):
        if self.cantidad < 0:
            raise ValidationError("La cantidad debe ser mayor o igual a cero.")

        if StockProducto.objects.filter(nombre__iexact=self.nombre, producto=self.producto).exclude(id=self.id).exists():
            raise ValidationError("Ya existe otro stock con el mismo nombre para este producto.")

class LineaPedido(models.Model):
    producto = models.ForeignKey(Producto, on_delete=models.SET_NULL, null=True)
    stock = models.ForeignKey(StockProducto, on_delete=models.SET_NULL, null=True)
    cantidad = models.IntegerField()
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "shop"

    def clean(self):
        if self.cantidad < 0:
            raise ValidationError("La cantidad debe ser mayor o igual a cero.")