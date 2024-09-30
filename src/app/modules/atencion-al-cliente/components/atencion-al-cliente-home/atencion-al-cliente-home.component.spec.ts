import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionAlClienteHomeComponent } from './atencion-al-cliente-home.component';

describe('AtencionAlClienteHomeComponent', () => {
  let component: AtencionAlClienteHomeComponent;
  let fixture: ComponentFixture<AtencionAlClienteHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtencionAlClienteHomeComponent]
    });
    fixture = TestBed.createComponent(AtencionAlClienteHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
