import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaPublicacionComponent } from './tabla-publicacion.component';

describe('TablaPublicacionComponent', () => {
  let component: TablaPublicacionComponent;
  let fixture: ComponentFixture<TablaPublicacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaPublicacionComponent]
    });
    fixture = TestBed.createComponent(TablaPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
