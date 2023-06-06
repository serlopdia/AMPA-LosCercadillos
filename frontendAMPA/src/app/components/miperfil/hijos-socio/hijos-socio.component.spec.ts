import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HijosSocioComponent } from './hijos-socio.component';

describe('HijosSocioComponent', () => {
  let component: HijosSocioComponent;
  let fixture: ComponentFixture<HijosSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HijosSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HijosSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
