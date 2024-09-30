import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovacionHomeComponent } from './innovacion-home.component';

describe('InnovacionHomeComponent', () => {
  let component: InnovacionHomeComponent;
  let fixture: ComponentFixture<InnovacionHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InnovacionHomeComponent]
    });
    fixture = TestBed.createComponent(InnovacionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
