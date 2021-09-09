import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRendererComponent } from './auth-renderer.component';

describe('AuthRendererComponent', () => {
  let component: AuthRendererComponent;
  let fixture: ComponentFixture<AuthRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
