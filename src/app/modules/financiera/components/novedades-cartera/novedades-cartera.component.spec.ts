import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadesCarteraComponent } from './novedades-cartera.component';

describe('NovedadesCarteraComponent', () => {
  let component: NovedadesCarteraComponent;
  let fixture: ComponentFixture<NovedadesCarteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovedadesCarteraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NovedadesCarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
