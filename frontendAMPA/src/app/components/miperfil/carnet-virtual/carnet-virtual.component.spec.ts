import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarnetVirtualComponent } from './carnet-virtual.component';

describe('CarnetVirtualComponent', () => {
  let component: CarnetVirtualComponent;
  let fixture: ComponentFixture<CarnetVirtualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarnetVirtualComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarnetVirtualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
