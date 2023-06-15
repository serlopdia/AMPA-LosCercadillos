import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelPayComponent } from './cancel-pay.component';

describe('CancelPayComponent', () => {
  let component: CancelPayComponent;
  let fixture: ComponentFixture<CancelPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelPayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
