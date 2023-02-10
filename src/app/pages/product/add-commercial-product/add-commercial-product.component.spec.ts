import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommercialProductComponent } from './add-commercial-product.component';

describe('AddCommercialProductComponent', () => {
  let component: AddCommercialProductComponent;
  let fixture: ComponentFixture<AddCommercialProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCommercialProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCommercialProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
