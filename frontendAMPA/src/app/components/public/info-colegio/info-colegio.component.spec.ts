import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoColegioComponent } from './info-colegio.component';

describe('InfoColegioComponent', () => {
  let component: InfoColegioComponent;
  let fixture: ComponentFixture<InfoColegioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoColegioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoColegioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
