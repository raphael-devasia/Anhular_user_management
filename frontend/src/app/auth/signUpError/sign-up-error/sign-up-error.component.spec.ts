import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignUpErrorComponent } from './sign-up-error.component';

describe('SignUpErrorComponent', () => {
  let component: SignUpErrorComponent;
  let fixture: ComponentFixture<SignUpErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignUpErrorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignUpErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
