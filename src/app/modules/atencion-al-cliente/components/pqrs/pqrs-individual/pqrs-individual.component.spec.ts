import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PqrsIndividualComponent } from './pqrs-individual.component';

describe('PqrsIndividualComponent', () => {
  let component: PqrsIndividualComponent;
  let fixture: ComponentFixture<PqrsIndividualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PqrsIndividualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PqrsIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
