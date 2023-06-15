import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosSocioComponent } from './pedidos-socio.component';

describe('PedidosSocioComponent', () => {
  let component: PedidosSocioComponent;
  let fixture: ComponentFixture<PedidosSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
