import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceAmpaComponent } from './balance-ampa.component';

describe('BalanceAmpaComponent', () => {
  let component: BalanceAmpaComponent;
  let fixture: ComponentFixture<BalanceAmpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceAmpaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceAmpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
