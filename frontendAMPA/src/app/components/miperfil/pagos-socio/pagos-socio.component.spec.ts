import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosSocioComponent } from './pagos-socio.component';

describe('PagosSocioComponent', () => {
  let component: PagosSocioComponent;
  let fixture: ComponentFixture<PagosSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagosSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
