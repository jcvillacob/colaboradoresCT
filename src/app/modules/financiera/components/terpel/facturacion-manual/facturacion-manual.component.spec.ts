import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturacionManualComponent } from './facturacion-manual.component';

describe('FacturacionManualComponent', () => {
  let component: FacturacionManualComponent;
  let fixture: ComponentFixture<FacturacionManualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturacionManualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturacionManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
