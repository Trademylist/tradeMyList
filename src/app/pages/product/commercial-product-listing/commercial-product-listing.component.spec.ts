import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialProductListingComponent } from './commercial-product-listing.component';

describe('CommercialProductListingComponent', () => {
  let component: CommercialProductListingComponent;
  let fixture: ComponentFixture<CommercialProductListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommercialProductListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialProductListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
