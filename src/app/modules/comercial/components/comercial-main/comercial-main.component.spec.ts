import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercialMainComponent } from './comercial-main.component';

describe('ComercialMainComponent', () => {
  let component: ComercialMainComponent;
  let fixture: ComponentFixture<ComercialMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComercialMainComponent]
    });
    fixture = TestBed.createComponent(ComercialMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
