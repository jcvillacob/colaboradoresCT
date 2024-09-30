import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenimientoMainComponent } from './mantenimiento-main.component';

describe('MantenimientoMainComponent', () => {
  let component: MantenimientoMainComponent;
  let fixture: ComponentFixture<MantenimientoMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MantenimientoMainComponent]
    });
    fixture = TestBed.createComponent(MantenimientoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
