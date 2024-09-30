import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosHomeComponent } from './usuarios-home.component';

describe('UsuariosHomeComponent', () => {
  let component: UsuariosHomeComponent;
  let fixture: ComponentFixture<UsuariosHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosHomeComponent]
    });
    fixture = TestBed.createComponent(UsuariosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
