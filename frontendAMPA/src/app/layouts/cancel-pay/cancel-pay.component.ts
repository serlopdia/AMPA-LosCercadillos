import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cancel-pay',
  templateUrl: './cancel-pay.component.html',
  styleUrls: ['./cancel-pay.component.scss']
})
export class CancelPayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    localStorage.removeItem('carrito');
  }

}
