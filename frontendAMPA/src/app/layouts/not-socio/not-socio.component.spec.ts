import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotSocioComponent } from './not-socio.component';

describe('NotSocioComponent', () => {
  let component: NotSocioComponent;
  let fixture: ComponentFixture<NotSocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotSocioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotSocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
