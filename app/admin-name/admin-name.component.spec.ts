
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNameComponent } from './admin-name.component';

describe('AdminNameComponent', () => {
  let component: AdminNameComponent;
  let fixture: ComponentFixture<AdminNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminNameComponent]
    });
    fixture = TestBed.createComponent(AdminNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
