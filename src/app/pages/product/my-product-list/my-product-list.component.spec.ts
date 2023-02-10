import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyProductListComponent } from './my-product-list.component';

describe('MyProductListComponent', () => {
  let component: MyProductListComponent;
  let fixture: ComponentFixture<MyProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyProductListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
