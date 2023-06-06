import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasSocioComponent } from './citas-socio.component';

describe('CitasSocioComponent', () => {
  let component: CitasSocioComponent;
  let fixture: ComponentFixture<CitasSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitasSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
