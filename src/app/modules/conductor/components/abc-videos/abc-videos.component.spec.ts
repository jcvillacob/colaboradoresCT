import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbcVideosComponent } from './abc-videos.component';

describe('AbcVideosComponent', () => {
  let component: AbcVideosComponent;
  let fixture: ComponentFixture<AbcVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbcVideosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbcVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
