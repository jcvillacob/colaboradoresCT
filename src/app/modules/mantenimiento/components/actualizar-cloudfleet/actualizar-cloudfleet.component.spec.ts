import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarCloudfleetComponent } from './actualizar-cloudfleet.component';

describe('ActualizarCloudfleetComponent', () => {
  let component: ActualizarCloudfleetComponent;
  let fixture: ComponentFixture<ActualizarCloudfleetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarCloudfleetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActualizarCloudfleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
