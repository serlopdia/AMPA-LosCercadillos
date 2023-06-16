import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSugerenciaComponent } from './show-sugerencia.component';

describe('ShowSugerenciaComponent', () => {
  let component: ShowSugerenciaComponent;
  let fixture: ComponentFixture<ShowSugerenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowSugerenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowSugerenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
