import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasProyectoComponent } from './tareas-proyecto.component';

describe('TareasProyectoComponent', () => {
  let component: TareasProyectoComponent;
  let fixture: ComponentFixture<TareasProyectoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TareasProyectoComponent]
    });
    fixture = TestBed.createComponent(TareasProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
