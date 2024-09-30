import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrucesComponent } from './cruces.component';

describe('CrucesComponent', () => {
  let component: CrucesComponent;
  let fixture: ComponentFixture<CrucesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrucesComponent]
    });
    fixture = TestBed.createComponent(CrucesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
