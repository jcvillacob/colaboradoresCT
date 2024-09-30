import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtencionaAlClienteMainComponent } from './atenciona-al-cliente-main.component';

describe('AtencionaAlClienteMainComponent', () => {
  let component: AtencionaAlClienteMainComponent;
  let fixture: ComponentFixture<AtencionaAlClienteMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AtencionaAlClienteMainComponent]
    });
    fixture = TestBed.createComponent(AtencionaAlClienteMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
