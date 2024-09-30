import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoAprobacionComponent } from './mantenimiento-aprobacion.component';

describe('MantenimientoAprobacionComponent', () => {
  let component: MantenimientoAprobacionComponent;
  let fixture: ComponentFixture<MantenimientoAprobacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MantenimientoAprobacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MantenimientoAprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
