from datetime import *
from rest_framework import serializers
from django.db.models import Q

from users.serializer import SocioSerializer
from .models import Asunto, Balance, Cita, Clase, Colaborador, CursoEscolar, EstadoPago, Evento, Hijo, Noticia, PagoCurso, Sugerencia, TipoClase, Vista

class VistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vista
        fields = ('id', 'tipo', 'markdown', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'tipo': {'required': True},
            'markdown': {'required': True},
        }

    def validate_tipo(self, value):
        if value not in ['PRINCIPAL', 'COLEGIO', 'COMEDOR', 'VENTAJAS']:
            raise serializers.ValidationError("El valor del campo 'tipo' debe ser uno de los siguientes: 'PRINCIPAL', 'COLEGIO', 'COMEDOR', 'VENTAJAS'")
        return value

    def create(self, validated_data):
        vista = Vista.objects.create(**validated_data)
        return vista

    def update(self, instance, validated_data):
        instance.tipo = validated_data.get('tipo', instance.tipo)
        instance.markdown = validated_data.get('markdown', instance.markdown)
        instance.save()
        return instance

class NoticiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Noticia
        fields = ('id', 'titulo', 'cuerpo', 'imagen', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'titulo': {'required': True},
            'cuerpo': {'required': True},
        }

    def create(self, validated_data):
        noticia = Noticia.objects.create(**validated_data)
        return noticia

    def update(self, instance, validated_data):
        instance.titulo = validated_data.get('titulo', instance.titulo)
        instance.cuerpo = validated_data.get('cuerpo', instance.cuerpo)
        instance.imagen = validated_data.get('imagen', instance.imagen)
        instance.save()
        return instance

class EventoSerializer(serializers.ModelSerializer):
    socios = SocioSerializer(many=True, read_only=True)

    class Meta:
        model = Evento
        fields = ('id', 'titulo', 'descripcion', 'capacidad', 'visible', 'fin_inscripcion', 'socios', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'titulo': {'required': True},
            'descripcion': {'required': True},
            'capacidad': {'required': True},
            'fin_inscripcion': {'required': True},
        }

    def validate_fin_inscripcion(self, value):
        # Obtener la fecha y hora actual con información de zona horaria
        now = datetime.now(timezone.utc)
        # Verificar que value no sea anterior a la fecha actual
        if value <= now:
            raise serializers.ValidationError("La fecha del evento debe ser futura a la fecha actual")
        return value

    def create(self, validated_data):
        socios_data = validated_data.pop('socios', [])
        evento = Evento.objects.create(**validated_data)
        for socio_data in socios_data:
            evento.socios.add(socio_data)
        return evento

    def update(self, instance, validated_data):
        socios_data = validated_data.pop('socios', [])
        instance = super().update(instance, validated_data)
        instance.socios.clear()
        for socio_data in socios_data:
            instance.socios.add(socio_data)
        return instance

class ColaboradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Colaborador
        fields = ('id', 'nombre', 'ventaja', 'descripcion', 'imagen', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'nombre': {'required': True},
            'descripcion': {'required': True},
        }

    def create(self, validated_data):
        colaborador = Colaborador.objects.create(**validated_data)
        return colaborador

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.ventaja = validated_data.get('ventaja', instance.ventaja)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.imagen = validated_data.get('imagen', instance.imagen)
        instance.save()
        return instance

class SugerenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sugerencia
        fields = ('id', 'titulo', 'descripcion', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'titulo': {'required': True},
            'descripcion': {'required': True},
        }

    def create(self, validated_data):
        sugerencia = Sugerencia.objects.create(**validated_data)
        return sugerencia

    def update(self, instance, validated_data):
        instance.titulo = validated_data.get('titulo', instance.titulo)
        instance.descripcion = validated_data.get('descripcion', instance.descripcion)
        instance.save()
        return instance

class BalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Balance
        fields = ('id', 'tipo', 'asunto', 'cantidad', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'tipo': {'required': True},
            'asunto': {'required': True},
            'cantidad': {'required': True},
        }

    def validate_tipo(self, value):
        if value not in ['INGRESO', 'GASTO']:
            raise serializers.ValidationError("El valor del campo 'tipo' debe ser uno de los siguientes: 'INGRESO', 'GASTO'")
        return value

    def create(self, validated_data):
        balance = Balance.objects.create(**validated_data)
        return balance

    def update(self, instance, validated_data):
        instance.tipo = validated_data.get('tipo', instance.tipo)
        instance.asunto = validated_data.get('asunto', instance.asunto)
        instance.cantidad = validated_data.get('cantidad', instance.cantidad)
        instance.save()
        return instance

class CursoEscolarSerializer(serializers.ModelSerializer):
    class Meta:
        model = CursoEscolar
        fields = ('id', 'nombre', 'precio_cuota', 'fecha_inicio', 'fecha_fin', 'actual', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'nombre': {'required': True},
            'precio_cuota': {'required': True},
            'fecha_inicio': {'required': True},
            'fecha_fin': {'required': True},
        }

    def validate(self, data):
        if data['fecha_fin'] <= data['fecha_inicio']:
            raise serializers.ValidationError('La fecha de finalización debe ser posterior a la fecha de inicio')
        # Validación 1: si no hay ningún curso con actual=True, se guarda el actual en True
        if data.get('actual') and not CursoEscolar.objects.filter(actual=True).exists():
            return data
        # Validación 2: si existe algún curso con actual=True, se cambia a False y se guarda el actual en True
        if data.get('actual') and data.get('actual') != self.instance.actual and \
           CursoEscolar.objects.filter(Q(actual=True) & ~Q(id=self.instance.id)).exists():
            CursoEscolar.objects.filter(actual=True).update(actual=False)
        return data

    def create(self, validated_data):
        curso_escolar = CursoEscolar.objects.create(**validated_data)
        return curso_escolar

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.precio_cuota = validated_data.get('precio_cuota', instance.precio_cuota)
        instance.fecha_inicio = validated_data.get('fecha_inicio', instance.fecha_inicio)
        instance.fecha_fin = validated_data.get('fecha_fin', instance.fecha_fin)
        instance.actual = validated_data.get('actual', instance.actual)
        instance.save()
        return instance

class ClaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clase
        fields = ('id', 'curso', 'letra', 'tipo_clase', 'curso_escolar', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'curso': {'required': True},
            'tipo_clase': {'required': True},
            'curso_escolar': {'required': True},
        }

    def validate_tipo_clase(self, value):
        if value not in ['INFANTIL', 'PRIMARIA']:
            raise serializers.ValidationError("El valor del campo 'tipo_clase' debe ser uno de los siguientes: 'INFANTIL', 'PRIMARIA'")
        return value

    def validate(self, data):
        # Verifica que no exista otra instancia de Clase con la misma combinación
        # de curso, letra, tipo_clase y curso_escolar.
        curso = data.get('curso')
        letra = data.get('letra')
        tipo_clase = data.get('tipo_clase')
        curso_escolar = data.get('curso_escolar')
        if Clase.objects.filter(
            curso=curso,
            letra=letra,
            tipo_clase=tipo_clase,
            curso_escolar=curso_escolar
        ).exists():
            raise serializers.ValidationError("Ya existe una clase con esta combinación de curso, letra, tipo de clase y curso escolar.")
        return data

    def create(self, validated_data):
        clase = Clase.objects.create(**validated_data)
        return clase

    def update(self, instance, validated_data):
        instance.curso = validated_data.get('curso', instance.curso)
        instance.letra = validated_data.get('letra', instance.letra)
        instance.tipo_clase = validated_data.get('tipo_clase', instance.tipo_clase)
        instance.curso_escolar = validated_data.get('curso_escolar', instance.curso_escolar)
        instance.save()
        return instance

class HijoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hijo
        fields = ('id', 'nombre', 'apellidos', 'fecha_nacimiento', 'socio', 'clase', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'nombre': {'required': True},
            'apellidos': {'required': True},
            'fecha_nacimiento': {'required': True},
            'socio': {'required': True},
        }

    def validate_fecha_nacimiento(self, value):
        if value >= datetime.today().date():
            raise serializers.ValidationError("La fecha de nacimiento debe ser anterior a la fecha actual")
        return value

    def create(self, validated_data):
        hijo = Hijo.objects.create(**validated_data)
        return hijo

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.apellidos = validated_data.get('apellidos', instance.apellidos)
        instance.fecha_nacimiento = validated_data.get('fecha_nacimiento', instance.fecha_nacimiento)
        instance.socio = validated_data.get('socio', instance.socio)
        instance.clase = validated_data.get('clase', instance.clase)
        instance.save()
        return instance

class AsuntoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asunto
        fields = ('id', 'nombre', 'fecha_inicio', 'fecha_fin', 'hora_inicio', 'hora_fin', 'minutos_frecuencia', 'dias_semana', 'visible', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'nombre': {'required': True},
            'fecha_inicio': {'required': True},
            'fecha_fin': {'required': True},
            'hora_inicio': {'required': True},
            'hora_fin': {'required': True},
            'minutos_frecuencia': {'required': True},
            'dias_semana': {'required': True},
        }

    def validate(self, data):
        # Valida que la fecha de fin sea posterior a la fecha de inicio
        if data['fecha_fin'] <= data['fecha_inicio']:
            raise serializers.ValidationError('La fecha de finalización debe ser posterior a la fecha de inicio')
        
        # Combina la fecha y hora de inicio y fin en objetos datetime.datetime
        fecha_hora_inicio = datetime.combine(data['fecha_inicio'], data['hora_inicio'])
        fecha_hora_fin = datetime.combine(data['fecha_fin'], data['hora_fin'])

        # Valida que la diferencia en minutos entre hora_inicio y hora_fin no sea menor a minutos_frecuencia
        minutos_diferencia = (fecha_hora_fin - fecha_hora_inicio).total_seconds() // 60
        if minutos_diferencia < data['minutos_frecuencia']:
            raise serializers.ValidationError('La diferencia en minutos entre hora de inicio y fin no puede ser menor a la frecuencia de minutos')

        # Valida que la diferencia en minutos entre hora_inicio y hora_fin sea divisible por minutos_frecuencia
        minutos_diferencia = (fecha_hora_fin - fecha_hora_inicio).total_seconds() // 60
        if minutos_diferencia % data['minutos_frecuencia'] != 0:
            raise serializers.ValidationError('La diferencia en minutos entre hora de inicio y fin debe ser múltiplo de los minutos de frecuencia')
        
        return data

    # Valida que todos los valores de la lista de días de la semana de un asunto se encuentren entre los valores permitidos
    def validate_dias_semana(self, value):
        accepted_values = {"LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES"}
        already_used_values = []
        found_accepted_value = False
        splitted = value.split(",")
        for part in splitted:
            if part.strip() in accepted_values and part.strip() not in already_used_values:
                already_used_values.append(part.strip())
                found_accepted_value = True
            elif part.strip() in accepted_values and part.strip() in already_used_values:
                raise serializers.ValidationError("No puede repetir días de la semana")
            else:
                raise serializers.ValidationError("Elige días de la semana válidos (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES)")

        if not found_accepted_value:
            raise serializers.ValidationError("Debe incluir al menos uno de los días de la semana válidos (LUNES, MARTES, MIERCOLES, JUEVES, VIERNES)")

        return value

    def create(self, validated_data):
        asunto = Asunto.objects.create(**validated_data)
        return asunto

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.fecha_inicio = validated_data.get('fecha_inicio', instance.fecha_inicio)
        instance.fecha_fin = validated_data.get('fecha_fin', instance.fecha_fin)
        instance.hora_inicio = validated_data.get('hora_inicio', instance.hora_inicio)
        instance.hora_fin = validated_data.get('hora_fin', instance.hora_fin)
        instance.minutos_frecuencia = validated_data.get('minutos_frecuencia', instance.minutos_frecuencia)
        instance.dias_semana = validated_data.get('dias_semana', instance.dias_semana)
        instance.visible = validated_data.get('visible', instance.visible)
        instance.save()
        return instance

class CitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cita
        fields = ('id', 'fecha', 'hora', 'socio', 'asunto', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'fecha': {'required': True},
            'hora': {'required': True},
            'socio': {'required': True},
            'asunto': {'required': True},
        }

    def validate_fecha(self, value):
        if value < datetime.today().date():
            raise serializers.ValidationError('La fecha de la cita debe ser posterior a la actual')
        return value

    def validate_hora(self, value):
        asunto = self.initial_data.get('asunto')
        if asunto:
            try:
                asunto_obj = Asunto.objects.get(id=asunto)
                hora_inicio = asunto_obj.hora_inicio
                hora_fin = asunto_obj.hora_fin
                minutos_frecuencia = asunto_obj.minutos_frecuencia

                fecha_cita = datetime.strptime(self.initial_data.get('fecha'), '%Y-%m-%d').date()
                hora_cita = time.fromisoformat(str(value))

                # Combina la fecha y hora de la cita en un objeto datetime para realizar comparaciones
                fecha_hora_cita = datetime.combine(fecha_cita, hora_cita)

                # Valida que la hora de la cita esté dentro del rango del asunto
                if not hora_inicio <= hora_cita <= hora_fin:
                    raise serializers.ValidationError('La hora de la cita debe estar dentro de los límites del asunto')

                # Valida que la diferencia en minutos entre la hora de inicio del asunto y la hora de la cita sea un múltiplo entero de minutos_frecuencia
                minutos_diferencia = (fecha_hora_cita - datetime.combine(fecha_cita, hora_inicio)).total_seconds() // 60
                if minutos_diferencia % minutos_frecuencia != 0:
                    raise serializers.ValidationError(f'La hora de la cita debe ser un múltiplo entero de {minutos_frecuencia} minutos')
            except Asunto.DoesNotExist:
                raise serializers.ValidationError("El asunto asociado no existe")
        else:
            raise serializers.ValidationError("No se ha proporcionado un asunto válido")
        return value
    
    def validate(self, data):
        cita = self.instance
        if cita is None or (
            data.get('fecha', cita.fecha) != cita.fecha or data.get('hora', cita.hora) != cita.hora
        ):
            # Obtiene los parámetros de fecha, hora y asunto de la nueva cita
            fecha_cita = datetime.strptime(data['fecha'].strftime('%Y-%m-%d'), '%Y-%m-%d').date()
            hora_cita = time.fromisoformat(str(data['hora']))
            asunto = data['asunto']

            # Verifica si ya existe una cita con los mismos parámetros
            citas_existentes = Cita.objects.filter(
                fecha=fecha_cita,
                hora=hora_cita,
                asunto=asunto
            ).exists()

            if citas_existentes:
                raise serializers.ValidationError('Ya existe una cita para el mismo día, misma hora y mismo asunto')

            # Obtiene el día de la semana de la cita en inglés
            dia_semana_cita = fecha_cita.strftime('%A')

            # Mapeo de nombres de días de la semana en inglés a español
            dias_semana_map = {
                'Monday': 'LUNES',
                'Tuesday': 'MARTES',
                'Wednesday': 'MIERCOLES',
                'Thursday': 'JUEVES',
                'Friday': 'VIERNES'
            }

            # Obtiene el día de la semana correspondiente en español
            dia_semana_cita_es = dias_semana_map.get(dia_semana_cita)

            # Valida que el día de la semana de la cita esté en la lista de días permitidos
            dias_semana_asunto = [dia.strip().upper() for dia in asunto.dias_semana.split(",")]
            if dia_semana_cita_es not in dias_semana_asunto:
                raise serializers.ValidationError('La fecha no corresponde a un día de semana entre los del asunto')

        return data

    def create(self, validated_data):
        cita = Cita.objects.create(**validated_data)
        return cita

    def update(self, instance, validated_data):
        instance.fecha = validated_data.get('fecha', instance.fecha)
        instance.hora = validated_data.get('hora', instance.hora)
        instance.socio = validated_data.get('socio', instance.socio)
        instance.asunto = validated_data.get('asunto', instance.asunto)
        instance.save()
        return instance

class PagoCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PagoCurso
        fields = ('id', 'cantidad', 'estado', 'socio', 'curso_escolar', 'created_at')
        read_only_fields = ('id', 'created_at')
        extra_kwargs = {
            'cantidad': {'required': True},
            'estado': {'required': True},
            'socio': {'required': True},
            'curso_escolar': {'required': True},
        }

    def validate(self, data):
        # Obtener el curso del pago
        curso_escolar = data['curso_escolar']

        # Verificar que no exista otro PagoCurso con el mismo socio y curso en estado "PAGADO" o "PENDIENTE"
        pagos = PagoCurso.objects.filter(socio=data['socio'], curso_escolar=curso_escolar, estado__in=[EstadoPago.PAGADO, EstadoPago.PENDIENTE])
        if self.instance:
            pagos = pagos.exclude(pk=self.instance.pk)
        if pagos.exists():
            raise serializers.ValidationError("Actualmente existe un pagoCurso asociado a este curso y socio en estado PAGADO o PENDIENTE")

        # Verificar que la cantidad es igual al precio_cuota del curso
        if data['cantidad'] != curso_escolar.precio_cuota:
            raise serializers.ValidationError("La cantidad del pago debe ser la misma que la del precio de la cuota del curso")

        return data
    
    def create(self, validated_data):
        pago_curso = PagoCurso.objects.create(**validated_data)
        return pago_curso

    def update(self, instance, validated_data):
        instance.cantidad = validated_data.get('cantidad', instance.cantidad)
        instance.estado = validated_data.get('estado', instance.estado)
        instance.save()
        return instance