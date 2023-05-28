import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStocksComponent } from './show-stocks.component';

describe('ShowStocksComponent', () => {
  let component: ShowStocksComponent;
  let fixture: ComponentFixture<ShowStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowStocksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
