import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoNovedadesComponent } from './mantenimiento-novedades.component';

describe('MantenimientoNovedadesComponent', () => {
  let component: MantenimientoNovedadesComponent;
  let fixture: ComponentFixture<MantenimientoNovedadesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoNovedadesComponent]
    });
    fixture = TestBed.createComponent(MantenimientoNovedadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
