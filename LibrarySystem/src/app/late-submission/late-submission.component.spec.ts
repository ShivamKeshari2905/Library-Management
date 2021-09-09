import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateSubmissionComponent } from './late-submission.component';

describe('LateSubmissionComponent', () => {
  let component: LateSubmissionComponent;
  let fixture: ComponentFixture<LateSubmissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateSubmissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LateSubmissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
