import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosMainComponent } from './usuarios-main.component';

describe('UsuariosMainComponent', () => {
  let component: UsuariosMainComponent;
  let fixture: ComponentFixture<UsuariosMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuariosMainComponent]
    });
    fixture = TestBed.createComponent(UsuariosMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
