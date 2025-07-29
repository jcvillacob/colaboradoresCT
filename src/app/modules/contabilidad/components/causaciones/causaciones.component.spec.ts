import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CausacionesComponent } from './causaciones.component';

describe('CausacionesComponent', () => {
  let component: CausacionesComponent;
  let fixture: ComponentFixture<CausacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CausacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CausacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
