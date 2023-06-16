from datetime import *
from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.db.models import Q
import re

from users.models import Socio

# Create your models here.
class TipoVista(models.TextChoices):
    PRINCIPAL = "PRINCIPAL", _("Principal"),
    COLEGIO = "COLEGIO", _("Colegio"),
    COMEDOR = "COMEDOR", _("Comedor"),
    CONTACTO = "CONTACTO", _("Contacto"),

class TipoBalance(models.TextChoices):
    INGRESO = "INGRESO", _("Ingreso"),
    GASTO = "GASTO", _("Gasto"),

class TipoClase(models.TextChoices):
    INFANTIL = "INFANTIL", _("Infantil"),
    PRIMARIA = "PRIMARIA", _("Primaria"),

class DiasSemana(models.TextChoices):
    LUNES = "LUNES", _("Lunes"),
    MARTES = "MARTES", _("Martes"),
    MIERCOLES = "MIERCOLES", _("Miércoles"),
    JUEVES = "JUEVES", _("Jueves"),
    VIERNES = "VIERNES", _("Viernes"),

class EstadoPago(models.TextChoices):
    PAGADO = "PAGADO", _("Pagado"),
    PENDIENTE = "PENDIENTE", _("Pendiente"),
    RECHAZADO = "RECHAZADO", _("Rechazado"),

class Vista(models.Model):
    tipo = models.CharField(choices=TipoVista.choices, max_length=64)
    markdown = models.TextField(default="", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

    def clean(self):
        if self.tipo not in ["PRINCIPAL", "COLEGIO", "COMEDOR", "VENTAJAS"]:
            raise ValidationError("El valor del campo 'tipo' debe ser uno de los siguientes: 'PRINCIPAL', 'COLEGIO', 'COMEDOR', 'VENTAJAS'")

class Noticia(models.Model):
    titulo = models.CharField(max_length=128)
    cuerpo = models.TextField(max_length=2048)
    imagen = models.CharField(max_length=2048, default="", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

class Evento(models.Model):
    titulo = models.CharField(max_length=128)
    descripcion = models.CharField(max_length=2048)
    capacidad = models.IntegerField()
    visible = models.BooleanField(default=True)
    fin_inscripcion = models.DateTimeField()
    socios = models.ManyToManyField(Socio, related_name='eventos', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"
    
    def clean(self):
        super().clean()
        if self.fecha_fin_inscripcion < datetime.today():
            raise ValidationError("La fecha fin de inscripción debe ser posterior a la fecha y hora actual")

class Colaborador(models.Model):
    nombre = models.CharField(max_length=64)
    ventaja = models.CharField(max_length=128, default="", blank=True)
    descripcion = models.CharField(max_length=2048)
    imagen = models.CharField(max_length=2048, default="", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

class Sugerencia(models.Model):
    nombre = models.CharField(max_length=64)
    email = models.CharField(max_length=128)
    titulo = models.CharField(max_length=128)
    descripcion = models.TextField(max_length=2048)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

    def clean(self):
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', self.email):
            raise ValidationError("El correo electrónico no tiene un formato válido.")

class Balance(models.Model):
    tipo = models.CharField(choices=TipoBalance.choices, max_length=64)
    asunto = models.CharField(max_length=128)
    cantidad = models.FloatField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "ampa"

    def clean(self):
        if self.tipo not in ["INGRESO", "GASTO"]:
            raise ValidationError("El tipo debe ser uno de los siguientes: 'INGRESO', 'GASTO'")

        if self.cantidad <= 0:
            raise ValidationError("El valor de la cantidad debe ser un número positivo")
        
class CursoEscolar(models.Model):
    nombre = models.CharField(max_length=64)
    precio_cuota = models.FloatField(max_length=64)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    actual = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

    def clean(self):
        if self.fecha_fin <= self.fecha_inicio:
            raise ValidationError('La fecha de finalización debe ser posterior a la fecha de inicio')

        if self.actual and not CursoEscolar.objects.filter(actual=True).exists():
            return

        if self.actual and self.actual != self.__class__.objects.filter(id=self.id).values_list('actual', flat=True)[0] and \
           CursoEscolar.objects.filter(Q(actual=True) & ~Q(id=self.id)).exists():
            CursoEscolar.objects.filter(actual=True).update(actual=False)

class Clase(models.Model):
    curso = models.IntegerField()
    letra = models.CharField(max_length=2)
    tipo_clase = models.CharField(choices=TipoClase.choices, max_length=16)
    curso_escolar = models.ForeignKey(CursoEscolar, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "ampa"

    def clean(self):
        if self.tipo_clase not in ["INFANTIL", "PRIMARIA"]:
            raise ValidationError("El valor del campo 'tipo_clase' debe ser uno de los siguientes: 'INFANTIL', 'PRIMARIA'")
        self.letra = self.letra.upper()
        if Clase.objects.filter(
            curso=self.curso,
            letra=self.letra,
            tipo_clase=self.tipo_clase,
            curso_escolar=self.curso_escolar
        ).exists():
            raise ValidationError("Ya existe una clase con esta combinación de curso, letra, tipo de clase y curso escolar.")
        
class Hijo(models.Model):
    nombre = models.CharField(max_length=64)
    apellidos = models.CharField(max_length=128)
    fecha_nacimiento = models.DateField()
    socio = models.ForeignKey(Socio, on_delete=models.CASCADE)
    clase = models.ForeignKey(Clase, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="users"
        
    def clean(self):
        if self.fecha_nacimiento >= datetime.today().date():
            raise ValidationError('La fecha de nacimiento debe ser anterior a la fecha actual')

class Asunto(models.Model):
    nombre = models.CharField(max_length=32)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    hora_inicio = models.TimeField(['%H:%M'])
    hora_fin = models.TimeField(['%H:%M'])
    minutos_frecuencia = models.IntegerField()
    dias_semana = models.CharField(max_length=64)
    visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "ampa"

    def clean(self):
        if self.fecha_fin <= self.fecha_inicio:
            raise ValidationError('La fecha de finalización debe ser posterior a la fecha de inicio')

        fecha_hora_inicio = datetime.combine(self.fecha_inicio, self.hora_inicio)
        fecha_hora_fin = datetime.combine(self.fecha_fin, self.hora_fin)

        minutos_diferencia = (fecha_hora_fin - fecha_hora_inicio).total_seconds() // 60
        if minutos_diferencia < self.minutos_frecuencia:
            raise ValidationError('La diferencia en minutos entre hora de inicio y fin no puede ser menor a la frecuencia de minutos')

        if minutos_diferencia % self.minutos_frecuencia != 0:
            raise ValidationError('La diferencia en minutos entre hora de inicio y fin debe ser múltiplo de los minutos de frecuencia')

        dias_semana_validos = {"LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"}
        dias_semana_ingresados = set(map(str.strip, self.dias_semana.split(',')))

        if not dias_semana_ingresados.intersection(dias_semana_validos):
            raise ValidationError("Debe incluir al menos uno de los días de la semana válidos (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES)")

        if len(dias_semana_ingresados) != len(set(filter(None, dias_semana_ingresados))):
            raise ValidationError("No puede repetir días de la semana")

        if dias_semana_ingresados - dias_semana_validos:
            raise ValidationError("Elige días de la semana válidos (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES)")

class Cita(models.Model):
    fecha = models.DateField()
    hora = models.TimeField()
    socio = models.ForeignKey(Socio, on_delete=models.CASCADE)
    asunto = models.ForeignKey(Asunto, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = "ampa"

    def clean(self):
        if self.fecha < datetime.today().date():
            raise ValidationError('La fecha de la cita debe ser posterior a la actual')

        asunto = self.asunto
        if asunto:
            hora_inicio = asunto.hora_inicio
            hora_fin = asunto.hora_fin
            minutos_frecuencia = asunto.minutos_frecuencia

            if not hora_inicio <= self.hora <= hora_fin:
                raise ValidationError('La hora de la cita debe estar dentro de los límites del asunto')

            minutos_diferencia = (datetime.combine(self.fecha, self.hora) - datetime.combine(self.fecha, hora_inicio)).total_seconds() // 60
            if minutos_diferencia % minutos_frecuencia != 0:
                raise ValidationError(f'La hora de la cita debe ser un múltiplo entero de {minutos_frecuencia} minutos')

        else:
            raise ValidationError("No se ha proporcionado un asunto válido")

        citas_existentes = Cita.objects.filter(
            fecha=self.fecha,
            hora=self.hora,
            asunto=self.asunto
        ).exclude(id=self.id).exists()

        if citas_existentes:
            raise ValidationError('Ya existe una cita para el mismo día, misma hora y mismo asunto')

        dias_semana_map = {
            'Monday': 'LUNES',
            'Tuesday': 'MARTES',
            'Wednesday': 'MIERCOLES',
            'Thursday': 'JUEVES',
            'Friday': 'VIERNES'
        }

        dia_semana_cita = self.fecha.strftime('%A')
        dia_semana_cita_es = dias_semana_map.get(dia_semana_cita)

        dias_semana_asunto = [dia.strip().upper() for dia in self.asunto.dias_semana.split(",")]
        if dia_semana_cita_es not in dias_semana_asunto:
            raise ValidationError('La fecha no corresponde a un día de semana entre los del asunto')

class PagoCurso(models.Model):
    cantidad = models.FloatField(max_length=64)
    estado = models.CharField(choices=EstadoPago.choices, max_length=64)
    socio = models.ForeignKey(Socio, on_delete=models.CASCADE)
    curso_escolar = models.ForeignKey(CursoEscolar, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

    def clean(self):
        super().clean()
        pagos = PagoCurso.objects.filter(socio=self.socio, curso_escolar=self.curso_escolar, estado__in=[EstadoPago.PAGADO, EstadoPago.PENDIENTE])
        if self.pk:
            pagos = pagos.exclude(pk=self.pk)
        if pagos.exists():
            raise ValidationError("Actualmente existe un pagoCurso asociado a este curso escolar y socio en estado PAGADO o PENDIENTE")

        if self.cantidad != self.curso_escolar.precio_cuota:
            raise ValidationError("La cantidad del pago debe ser la misma que la del precio de la cuota del curso escolar")
