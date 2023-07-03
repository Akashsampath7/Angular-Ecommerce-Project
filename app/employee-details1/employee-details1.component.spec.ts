import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeDetails1Component } from './employee-details1.component';

describe('EmployeeDetails1Component', () => {
  let component: EmployeeDetails1Component;
  let fixture: ComponentFixture<EmployeeDetails1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeDetails1Component]
    });
    fixture = TestBed.createComponent(EmployeeDetails1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
