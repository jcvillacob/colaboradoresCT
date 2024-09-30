import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearProyectoModalComponent } from './crear-proyecto-modal.component';

describe('CrearProyectoModalComponent', () => {
  let component: CrearProyectoModalComponent;
  let fixture: ComponentFixture<CrearProyectoModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearProyectoModalComponent]
    });
    fixture = TestBed.createComponent(CrearProyectoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
