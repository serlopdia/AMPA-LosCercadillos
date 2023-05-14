from datetime import *
from django.db import models
from django.forms import ValidationError
from django.utils.translation import gettext_lazy as _
from django.db.models import Q

from users.models import Socio

# Create your models here.

class TipoVista(models.TextChoices):
    PRINCIPAL = "PRINCIPAL", _("Principal"),
    COLEGIO = "COLEGIO", _("Colegio"),
    COMEDOR = "COMEDOR", _("Comedor"),

class TipoBalance(models.TextChoices):
    INGRESO = "INGRESO", _("Ingreso"),
    GASTO = "GASTO", _("Gasto"),

class TipoClase(models.TextChoices):
    PRIMARIA = "PRIMARIA", _("Primaria"),
    PREESCOLAR = "PREESCOLAR", _("Preescolar"),

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
        if self.tipo not in ["PRINCIPAL", "COLEGIO", "COMEDOR"]:
            raise ValidationError("El valor del campo 'tipo' debe ser uno de los siguientes: 'PRINCIPAL', 'COLEGIO', 'COMEDOR'")

class Noticia(models.Model):
    titulo = models.CharField(max_length=64)
    cuerpo = models.TextField(max_length=1024)
    imagen = models.CharField(max_length=512, default="", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

class Evento(models.Model):
    titulo = models.CharField(max_length=64)
    descripcion = models.CharField(max_length=512)
    capacidad = models.IntegerField()
    visible = models.BooleanField(default=True)
    fin_inscripcion = models.DateTimeField()
    socios = models.ManyToManyField(Socio, related_name='eventos', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"
    
    def clean(self):
        super().clean()
        # Verificar que la fecha_fin_inscripcion no sea anterior a la fecha actual
        if self.fecha_fin_inscripcion < datetime.today():
            raise ValidationError("La fecha fin de inscripción debe ser posterior a la fecha y hora actual")

class Colaborador(models.Model):
    nombre = models.CharField(max_length=64)
    ventaja = models.CharField(max_length=64)
    descripcion = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

class Sugerencia(models.Model):
    titulo = models.CharField(max_length=64)
    descripcion = models.TextField(max_length=1024)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

class Balance(models.Model):
    tipo = models.CharField(choices=TipoBalance.choices, max_length=64)
    asunto = models.CharField(max_length=128)
    cantidad = models.FloatField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

    def clean(self):
        if self.tipo not in ["INGRESO", "GASTO"]:
            raise ValidationError("El valor del campo 'tipo' debe ser uno de los siguientes: 'INGRESO', 'GASTO'")

class CursoEscolar(models.Model):
    nombre = models.CharField(max_length=64)
    precio_cuota = models.FloatField(max_length=64)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    actual = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

    def clean(self):
        if self.fecha_fin <= self.fecha_inicio:
            raise ValidationError('La fecha de finalización debe ser posterior a la fecha de inicio')
        
        # Validación 1: si no hay ningún curso con actual=True, se guarda el actual en True
        if self.actual and not CursoEscolar.objects.filter(actual=True).exists():
            return

        # Validación 2: si existe algún curso con actual=True, se cambia a False y se guarda el actual en True
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
        app_label="ampa"

    def clean(self):
        # Verificar si ya existe un registro con la misma combinación
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
        # Compara la fecha de nacimiento con la fecha actual
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
        app_label="ampa"
    
    def clean(self):
        if self.fecha_fin < datetime.today().date():
            raise ValidationError('La fecha de finalización debe ser posterior a la fecha actual')

        if self.fecha_fin <= self.fecha_inicio:
            raise ValidationError("La fecha de finalización debe ser posterior a la fecha de inicio")

        fecha_hora_inicio = datetime.combine(self.fecha_inicio, self.hora_inicio)
        fecha_hora_fin = datetime.combine(self.fecha_fin, self.hora_fin)

        tiempo_transcurrido = fecha_hora_fin - fecha_hora_inicio
        minutos_transcurridos = tiempo_transcurrido.total_seconds() / 60

        if minutos_transcurridos < self.minutos_frecuencia:
            raise ValidationError("La duración de cada cita debe ser mayor o igual al valor de minutos_frecuencia")

        dias_semana_validos = [dia[0] for dia in DiasSemana.choices]
        for dia in self.dias_semana.split(','):
            if dia.strip() not in dias_semana_validos:
                raise ValidationError(f"El valor {dia} no es un día válido de la semana")

class Cita(models.Model):
    fecha = models.DateField()
    hora = models.TimeField()
    socio = models.ForeignKey(Socio, on_delete=models.CASCADE)
    asunto = models.ForeignKey(Asunto, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label="ampa"

    def clean(self):
        if self.fecha < self.asunto.fecha_inicio or self.fecha > self.asunto.fecha_fin:
            raise ValidationError("La fecha de la cita debe estar dentro del rango de fechas del asunto")

        if self.hora < self.asunto.hora_inicio or self.hora > self.asunto.hora_fin:
            raise ValidationError("La hora de la cita debe estar dentro del rango de horas del asunto")

        tiempo_transcurrido = (self.hora - self.asunto.hora_inicio).total_seconds() // 60

        if tiempo_transcurrido % self.asunto.minutos_frecuencia != 0:
            raise ValidationError("La hora de la cita debe estar dentro de los tiempos permitidos por minutos_frecuencia")

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
        # Verificar que no exista otro PagoCurso con el mismo socio y curso en estado "PAGADO" o "PENDIENTE"
        pagos = PagoCurso.objects.filter(socio=self.socio, curso_escolar=self.curso_escolar, estado__in=[EstadoPago.PAGADO, EstadoPago.PENDIENTE])
        if self.pk:
            pagos = pagos.exclude(pk=self.pk)
        if pagos.exists():
            raise ValidationError("Actualmente existe un pagoCurso asociado a este curso escolar y socio en estado PAGADO o PENDIENTE")

        # Verificar que la cantidad es igual al precio_cuota del curso escolar
        if self.cantidad != self.curso_escolar.precio_cuota:
            raise ValidationError("La cantidad del pago debe ser la misma que la del precio de la cuota del curso escolar")
