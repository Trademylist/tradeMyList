import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFreebiesComponent } from './add-freebies.component';

describe('AddFreebiesComponent', () => {
  let component: AddFreebiesComponent;
  let fixture: ComponentFixture<AddFreebiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFreebiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFreebiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
