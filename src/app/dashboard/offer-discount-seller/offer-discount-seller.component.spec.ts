import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDiscountSellerComponent } from './offer-discount-seller.component';

describe('OfferDiscountSellerComponent', () => {
  let component: OfferDiscountSellerComponent;
  let fixture: ComponentFixture<OfferDiscountSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDiscountSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDiscountSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
