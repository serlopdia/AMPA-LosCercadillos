import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoComedorComponent } from './info-comedor.component';

describe('InfoComedorComponent', () => {
  let component: InfoComedorComponent;
  let fixture: ComponentFixture<InfoComedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoComedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoComedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
