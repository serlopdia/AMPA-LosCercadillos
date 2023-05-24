import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoContactoComponent } from './info-contacto.component';

describe('InfoContactoComponent', () => {
  let component: InfoContactoComponent;
  let fixture: ComponentFixture<InfoContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoContactoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
