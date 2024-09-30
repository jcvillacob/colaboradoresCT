import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPublicacionComponent } from './agregar-publicacion.component';

describe('AgregarPublicacionComponent', () => {
  let component: AgregarPublicacionComponent;
  let fixture: ComponentFixture<AgregarPublicacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AgregarPublicacionComponent]
    });
    fixture = TestBed.createComponent(AgregarPublicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
