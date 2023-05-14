from django.db.models.signals import post_migrate, post_save
from django.dispatch import receiver
from .models import *
from django.contrib.auth.models import User
from users.models import Socio
from datetime import datetime, date, time
import pytz

codigo_markdown = """
# Título del documento

Este es un párrafo de texto regular. **Negrita** y *cursiva* son formatos comunes en Markdown.

## Encabezado de nivel 2

### Encabezado de nivel 3

#### Encabezado de nivel 4

- Lista desordenada
- Otro elemento de lista

1. Lista numerada
2. Otro elemento de lista numerada

Puedes insertar enlaces [como este](https://www.ejemplo.com) y también imágenes ![descripción de la imagen](ruta/imagen.png).

> Esto es un bloque de cita. 

`Código en línea` se representa entre acentos graves, y bloques de código:
"""

@receiver(post_migrate, dispatch_uid="dependent_logic_signal")
def create_ampa(sender, **kwargs):
    if sender.name == "ampa":
        timezone = pytz.timezone("Europe/Madrid")
        socio = Socio.objects.filter(id=1).first()
        if not Vista.objects.exists():
            vista_principal = Vista.objects.create(tipo="PRINCIPAL", markdown=codigo_markdown)
            vista_principal.save()
            vista_colegio = Vista.objects.create(tipo="COLEGIO", markdown=codigo_markdown)
            vista_colegio.save()
            vista_comedor = Vista.objects.create(tipo="COMEDOR", markdown=codigo_markdown)
            vista_comedor.save()
            
        if not Noticia.objects.exists():
            noticia_sample_uno = Noticia.objects.create(titulo="Título de la noticia", cuerpo="Cuerpo de la noticia", imagen="https://media.istockphoto.com/id/469182248/es/foto/titular-de-peri%C3%B3dico-con-el-comunicado-de-prensa.jpg?s=612x612&w=0&k=20&c=3n5aqYwqSBkDUK2T7PxeY5T2L08uM0TXVhfr9QZKknc=")
            noticia_sample_uno.save()
            noticia_sample_dos = Noticia.objects.create(titulo="Noticia de bolsa", cuerpo="La imagen representa unas gráficas de bolsa", imagen="https://alicanteplaza.es/public/Image/2021/6/1609779456ibex_NoticiaAmpliada_NoticiaAmpliada.jpg")
            noticia_sample_dos.save()

        if not Evento.objects.exists():
            evento_sample_uno = Evento.objects.create(titulo="Conferencia de Tecnología", descripcion="Una conferencia sobre las últimas tendencias en tecnología", capacidad=100, visible=True, fin_inscripcion=datetime(2023, 6, 1, 18, 0, tzinfo=timezone))
            evento_sample_uno.save()
            evento_sample_dos = Evento.objects.create(titulo="Taller de Arte", descripcion="Un taller práctico para explorar tu creatividad artística", capacidad=10, visible=True, fin_inscripcion=datetime(2023, 9, 21, 23, 0, tzinfo=timezone))
            evento_sample_dos.save()

        if not Colaborador.objects.exists():
            colaborador_sample_uno = Colaborador.objects.create(nombre="CarKey", ventaja="20% de descuento en la primera compra", descripcion="Llaves de coche y asistencia en automóviles.")
            colaborador_sample_uno.save()
            colaborador_sample_dos = Colaborador.objects.create(nombre="Cafetería La Estación", ventaja="2€ de churros gratis en una cuenta de 20€", descripcion="Expertos en desayunos y almuerzos.")
            colaborador_sample_dos.save()

        if not Sugerencia.objects.exists():
            sugerencia_sample_uno = Sugerencia.objects.create(titulo="Mejora en el programa de tutorías", descripcion="Propongo implementar un sistema de tutorías más estructurado y personalizado para los estudiantes.")
            sugerencia_sample_uno.save()
            sugerencia_sample_dos = Sugerencia.objects.create(titulo="Ampliación del horario de la biblioteca", descripcion="Sería beneficioso extender el horario de la biblioteca para que los estudiantes tengan más tiempo de estudio por las tardes y los fines de semana.")
            sugerencia_sample_dos.save()

        if not Balance.objects.exists():
            balance_sample_uno = Balance.objects.create(tipo="INGRESO", asunto="Venta de productos", cantidad=50.43)
            balance_sample_uno.save()
            balance_sample_dos = Balance.objects.create(tipo="GASTO", asunto="Pago de facturas", cantidad=25.0)
            balance_sample_dos.save()

        if not CursoEscolar.objects.exists():
            curso_escolar_sample_uno = CursoEscolar.objects.create(nombre="Curso 2022-2023", precio_cuota=14.0, fecha_inicio=datetime(2022, 9, 1, tzinfo=timezone), fecha_fin=datetime(2023, 6, 30, tzinfo=timezone), actual=True)
            curso_escolar_sample_uno.save()
            curso_escolar_sample_dos = CursoEscolar.objects.create(nombre="Curso 2023-2024", precio_cuota=15.50, fecha_inicio=datetime(2023, 9, 1, tzinfo=timezone), fecha_fin=datetime(2024, 6, 30, tzinfo=timezone), actual=False)
            curso_escolar_sample_dos.save()

        if not Clase.objects.exists():
            curso_escolar = CursoEscolar.objects.get(id=1)
            clase_sample_uno = Clase.objects.create(curso=3, letra="A", tipo_clase="Primaria", curso_escolar=curso_escolar)
            clase_sample_uno.save()
            clase_sample_dos = Clase.objects.create(curso=1, letra="B", tipo_clase="Preescolar", curso_escolar=curso_escolar)
            clase_sample_dos.save()

        if socio and not Hijo.objects.filter(socio=socio).exists():
            clase_sample_uno = Clase.objects.get(id=1)
            clase_sample_dos = Clase.objects.get(id=2)
            hijo_sample_uno = Hijo.objects.create(nombre="Juan", apellidos="Pérez", fecha_nacimiento=date(2010, 5, 10), socio=socio, clase=clase_sample_uno)
            hijo_sample_uno.save()
            hijo_sample_dos = Hijo.objects.create(nombre="María", apellidos="López", fecha_nacimiento=date(2012, 8, 15), socio=socio, clase=clase_sample_dos)
            hijo_sample_dos.save()

        if not Asunto.objects.exists():
            asunto_sample_uno = Asunto.objects.create(nombre="Inscripción AMPA", fecha_inicio=date(2023, 6, 1), fecha_fin=date(2023, 12, 31), hora_inicio=time(9, 0), hora_fin=time(10, 0), minutos_frecuencia=10, dias_semana="LUNES, MIERCOLES, VIERNES", visible=True)
            asunto_sample_uno.save(); 
            asunto_sample_dos = Asunto.objects.create(nombre="Recogida de dinero orla", fecha_inicio=date(2023, 9, 1), fecha_fin=date(2023, 12, 31), hora_inicio=time(14, 0), hora_fin=time(15, 0), minutos_frecuencia=25, dias_semana="MARTES, JUEVES", visible=True); 
            asunto_sample_dos.save()

        if socio and not Cita.objects.exists():
            asunto_sample_uno = Asunto.objects.get(id=1)
            asunto_sample_dos = Asunto.objects.get(id=2)
            cita_sample_uno = Cita.objects.create(fecha=date(2023, 6, 7), hora=time(9, 0), socio=socio, asunto=asunto_sample_uno)
            cita_sample_uno.save()
            cita_sample_dos = Cita.objects.create(fecha=date(2023, 9, 14), hora=time(14, 0), socio=socio, asunto=asunto_sample_dos)
            cita_sample_dos.save()

        if socio and not PagoCurso.objects.exists():
            curso_escolar = CursoEscolar.objects.get(id=1)
            pago_sample_curso = PagoCurso.objects.create(cantidad=14.0, estado=EstadoPago.PAGADO, socio=socio, curso_escolar=curso_escolar)
            pago_sample_curso.save()










