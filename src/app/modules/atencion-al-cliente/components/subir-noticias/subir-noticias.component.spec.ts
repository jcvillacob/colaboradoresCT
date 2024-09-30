import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirNoticiasComponent } from './subir-noticias.component';

describe('SubirNoticiasComponent', () => {
  let component: SubirNoticiasComponent;
  let fixture: ComponentFixture<SubirNoticiasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubirNoticiasComponent]
    });
    fixture = TestBed.createComponent(SubirNoticiasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
