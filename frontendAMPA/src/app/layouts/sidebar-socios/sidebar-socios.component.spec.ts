import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSociosComponent } from './sidebar-socios.component';

describe('SidebarSociosComponent', () => {
  let component: SidebarSociosComponent;
  let fixture: ComponentFixture<SidebarSociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarSociosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
