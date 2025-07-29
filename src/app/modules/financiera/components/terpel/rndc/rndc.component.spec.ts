import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RndcComponent } from './rndc.component';

describe('RndcComponent', () => {
  let component: RndcComponent;
  let fixture: ComponentFixture<RndcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RndcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RndcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
