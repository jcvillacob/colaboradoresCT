import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TareasUsuarioComponent } from './tareas-usuario.component';

describe('TareasUsuarioComponent', () => {
  let component: TareasUsuarioComponent;
  let fixture: ComponentFixture<TareasUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TareasUsuarioComponent]
    });
    fixture = TestBed.createComponent(TareasUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
