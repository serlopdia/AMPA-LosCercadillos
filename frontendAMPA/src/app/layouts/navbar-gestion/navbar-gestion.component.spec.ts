import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarGestionComponent } from './navbar-gestion.component';

describe('NavbarGestionComponent', () => {
  let component: NavbarGestionComponent;
  let fixture: ComponentFixture<NavbarGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarGestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
