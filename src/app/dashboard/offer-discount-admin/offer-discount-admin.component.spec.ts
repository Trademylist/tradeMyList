import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferDiscountAdminComponent } from './offer-discount-admin.component';

describe('OfferDiscountAdminComponent', () => {
  let component: OfferDiscountAdminComponent;
  let fixture: ComponentFixture<OfferDiscountAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferDiscountAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferDiscountAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
