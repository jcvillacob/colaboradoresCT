import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovacionMainComponent } from './innovacion-main.component';

describe('InnovacionMainComponent', () => {
  let component: InnovacionMainComponent;
  let fixture: ComponentFixture<InnovacionMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InnovacionMainComponent]
    });
    fixture = TestBed.createComponent(InnovacionMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
