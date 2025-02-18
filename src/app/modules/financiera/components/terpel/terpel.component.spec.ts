import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerpelComponent } from './terpel.component';

describe('TerpelComponent', () => {
  let component: TerpelComponent;
  let fixture: ComponentFixture<TerpelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerpelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TerpelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
