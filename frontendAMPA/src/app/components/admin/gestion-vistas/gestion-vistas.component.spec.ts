import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionVistasComponent } from './gestion-vistas.component';

describe('GestionVistasComponent', () => {
  let component: GestionVistasComponent;
  let fixture: ComponentFixture<GestionVistasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionVistasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionVistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
