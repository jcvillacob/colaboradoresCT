import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoHomeComponent } from './mantenimiento-home.component';

describe('MantenimientoHomeComponent', () => {
  let component: MantenimientoHomeComponent;
  let fixture: ComponentFixture<MantenimientoHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoHomeComponent]
    });
    fixture = TestBed.createComponent(MantenimientoHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
