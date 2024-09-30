import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConductorMainComponent } from './conductor-main.component';

describe('ConductorMainComponent', () => {
  let component: ConductorMainComponent;
  let fixture: ComponentFixture<ConductorMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConductorMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConductorMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
