import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAsuntoComponent } from './show-asunto.component';

describe('ShowAsuntoComponent', () => {
  let component: ShowAsuntoComponent;
  let fixture: ComponentFixture<ShowAsuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAsuntoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAsuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
