import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';
import { UsersService } from 'src/app/services/users.service';

interface Socio {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  tel: string;
  dni: string;
  address: string;
  username: string;
  password: string;
  created_at: string;
}
interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  capacidad: number;
  visible: boolean;
  fin_inscripcion: string;
  socios: Socio[];
  created_at: string;
}

@Component({
  selector: 'app-socios-evento',
  templateUrl: './socios-evento.component.html',
  styleUrls: ['./socios-evento.component.scss']
})
export class SociosEventoComponent implements OnInit {
  
  evento!:Evento;
  listaSocios: Socio[] = [];

  constructor(private eventoService: EventoService, private route: ActivatedRoute, private renderer: Renderer2) { }

  ngOnInit() {
    this.getDatosEvento();
  }
  
  async getDatosEvento(): Promise<void>{
    let idEvento = this.route.snapshot.paramMap.get('id');
    this.eventoService.getEvento(idEvento).subscribe({
      next:data=>{
        this.evento = data as Evento;
        this.listaSocios = this.evento.socios;
      },
      error:err=>{
        console.log(err.error.message);
      }
    })
  }
  
  detallesSocio(idSocio: any) {
    window.location.href = '/dashboard/socios?detallesSocio=' + idSocio;
  }

  enviarCorreo() {
    const correos = this.listaSocios.map(socio => socio.email).join(',');
    const enlaceCorreo = `mailto:${correos}`;
    const ancla = this.renderer.createElement('a');
    this.renderer.setAttribute(ancla, 'href', enlaceCorreo);
    ancla.click();
  }

}

