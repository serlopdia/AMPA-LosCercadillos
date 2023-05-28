import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowHijosComponent } from './show-hijos.component';

describe('ShowHijosComponent', () => {
  let component: ShowHijosComponent;
  let fixture: ComponentFixture<ShowHijosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowHijosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowHijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
