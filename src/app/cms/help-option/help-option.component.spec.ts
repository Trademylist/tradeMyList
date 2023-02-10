import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpOptionComponent } from './help-option.component';

describe('HelpOptionComponent', () => {
  let component: HelpOptionComponent;
  let fixture: ComponentFixture<HelpOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpOptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
