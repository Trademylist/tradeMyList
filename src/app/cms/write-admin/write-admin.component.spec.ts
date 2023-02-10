import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteAdminComponent } from './write-admin.component';

describe('WriteAdminComponent', () => {
  let component: WriteAdminComponent;
  let fixture: ComponentFixture<WriteAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WriteAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
