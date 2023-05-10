import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionBalanceComponent } from './gestion-balance.component';

describe('GestionBalanceComponent', () => {
  let component: GestionBalanceComponent;
  let fixture: ComponentFixture<GestionBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
