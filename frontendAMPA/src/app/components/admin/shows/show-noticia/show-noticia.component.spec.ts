import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNoticiaComponent } from './show-noticia.component';

describe('ShowNoticiaComponent', () => {
  let component: ShowNoticiaComponent;
  let fixture: ComponentFixture<ShowNoticiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowNoticiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowNoticiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
