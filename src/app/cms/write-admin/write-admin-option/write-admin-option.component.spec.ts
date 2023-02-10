import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteAdminOptionComponent } from './write-admin-option.component';

describe('WriteAdminOptionComponent', () => {
  let component: WriteAdminOptionComponent;
  let fixture: ComponentFixture<WriteAdminOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteAdminOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteAdminOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
