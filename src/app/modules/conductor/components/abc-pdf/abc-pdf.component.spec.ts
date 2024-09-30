import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbcPdfComponent } from './abc-pdf.component';

describe('AbcPdfComponent', () => {
  let component: AbcPdfComponent;
  let fixture: ComponentFixture<AbcPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbcPdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbcPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
