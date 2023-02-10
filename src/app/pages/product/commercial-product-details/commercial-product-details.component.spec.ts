import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialProductDetailsComponent } from './commercial-product-details.component';

describe('CommercialProductDetailsComponent', () => {
  let component: CommercialProductDetailsComponent;
  let fixture: ComponentFixture<CommercialProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialProductDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
