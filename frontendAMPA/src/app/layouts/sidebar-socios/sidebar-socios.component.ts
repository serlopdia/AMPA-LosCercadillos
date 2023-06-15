import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-sidebar-socios',
  templateUrl: './sidebar-socios.component.html',
  styleUrls: ['./sidebar-socios.component.scss']
})
export class SidebarSociosComponent implements OnInit {

  esSocio = false;
  
  constructor(private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.checkEsSocio().subscribe(esSocio => {
      this.esSocio = esSocio;
    }, error => {
      console.log(error);
    });
  }

}
