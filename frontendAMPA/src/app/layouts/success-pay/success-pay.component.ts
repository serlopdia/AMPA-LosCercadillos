import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-success-pay',
  templateUrl: './success-pay.component.html',
  styleUrls: ['./success-pay.component.scss']
})
export class SuccessPayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    localStorage.removeItem('carrito');
  }

}
