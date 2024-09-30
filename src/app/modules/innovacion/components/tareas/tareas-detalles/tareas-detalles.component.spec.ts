import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasDetallesComponent } from './tareas-detalles.component';

describe('TareasDetallesComponent', () => {
  let component: TareasDetallesComponent;
  let fixture: ComponentFixture<TareasDetallesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TareasDetallesComponent]
    });
    fixture = TestBed.createComponent(TareasDetallesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
