import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosEventoComponent } from './socios-evento.component';

describe('SociosEventoComponent', () => {
  let component: SociosEventoComponent;
  let fixture: ComponentFixture<SociosEventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SociosEventoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociosEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
