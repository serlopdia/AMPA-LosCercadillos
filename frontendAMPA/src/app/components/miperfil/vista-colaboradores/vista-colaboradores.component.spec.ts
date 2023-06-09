import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaColaboradoresComponent } from './vista-colaboradores.component';

describe('VistaColaboradoresComponent', () => {
  let component: VistaColaboradoresComponent;
  let fixture: ComponentFixture<VistaColaboradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaColaboradoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaColaboradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
