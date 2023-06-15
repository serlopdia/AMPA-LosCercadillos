import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPasswordSocioComponent } from './editar-password-socio.component';

describe('EditarPasswordSocioComponent', () => {
  let component: EditarPasswordSocioComponent;
  let fixture: ComponentFixture<EditarPasswordSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditarPasswordSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPasswordSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
