import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductorHomeComponent } from './conductor-home.component';

describe('ConductorHomeComponent', () => {
  let component: ConductorHomeComponent;
  let fixture: ComponentFixture<ConductorHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConductorHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConductorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
