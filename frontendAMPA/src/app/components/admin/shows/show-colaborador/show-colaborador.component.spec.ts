import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowColaboradorComponent } from './show-colaborador.component';

describe('ShowColaboradorComponent', () => {
  let component: ShowColaboradorComponent;
  let fixture: ComponentFixture<ShowColaboradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowColaboradorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
