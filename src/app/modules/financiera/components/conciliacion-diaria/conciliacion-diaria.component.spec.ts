import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliacionDiariaComponent } from './conciliacion-diaria.component';

describe('ConciliacionDiariaComponent', () => {
  let component: ConciliacionDiariaComponent;
  let fixture: ComponentFixture<ConciliacionDiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConciliacionDiariaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConciliacionDiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
