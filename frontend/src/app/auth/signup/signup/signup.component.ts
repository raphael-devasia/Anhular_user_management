import { Component, inject, Input, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../model/user.medel';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ReactiveFormsModule,
  FormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { SignUpErrorComponent } from '../../signUpError/sign-up-error/sign-up-error.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SignupSuccessComponent } from '../../signUpSuccess/signup-success/signup-success.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SignUpErrorComponent,
    SignupSuccessComponent,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit {
  toastr = inject(ToastrService);
  operation: any = inject(MAT_DIALOG_DATA, { optional: true }) || null;
  operationFromParent: string = '';
  signupForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
  });
  role: string = 'user';
  userRegistration = inject(AuthService);
  modalPopup = inject(MatDialog);
  router = inject(Router);
  submitted = false;
  operationValue = this.operation?.operation || this.operationFromParent;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.operationValue);

    const currentUrl = this.router.url;
    if (
      currentUrl.includes('/admin/signup') ||
      currentUrl.includes('/admin/profile')
    ) {
      this.role = 'admin';
    } else if (currentUrl.includes('/signup')) {
      this.role = 'user';
    }

    const token = localStorage.getItem('jwt');
    const adminToken = localStorage.getItem('adminToken');
    if (token && this.role === 'user') {
      this.router.navigate(['profile']);
    }
    if (adminToken && this.role === 'admin') {
      this.router.navigate(['admin/profile']);
    }
    this.signupForm = this.formBuilder.group(
      {
        firstName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            this.onlyAlphabetsValidator,
          ],
        ],
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            this.onlyAlphabetsValidator,
          ],
        ],
        phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }
  onlyAlphabetsValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const valid = /^[a-zA-Z]+$/.test(value);
    return valid ? null : { onlyAlphabets: true };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  registerFormSubmit() {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    const user: IUser = {
      ...this.signupForm.value,
      role: this.role,
      operator: this.operationValue,
    };
    this.userRegistration.registerUser(user).subscribe(
      (res: any) => {
        this.signupForm.reset();
        if (this.operationValue == 'adduser') {
          this.modalPopup.closeAll();
          this.router.navigate(['admin/profile']).then(() => {
            this.toastr.show('User Added Successfully');
            setTimeout(() => {
              window.location.reload();
            }, 1000); // 1-second delay before reload
          });
          
        } else {
          this.modalPopup.open(SignupSuccessComponent, {
            width: '30%',
            height: '70%',
          });
          setTimeout(() => {
            this.modalPopup.closeAll();
            this.router.navigate(['login']);
          }, 3000); //5s
        }
      },
      (error) => {
        console.log(error);
        this.modalPopup.open(SignUpErrorComponent, {
          width: '30%',
          height: '75%',
        });
        if (this.operationValue == 'adduser') {
        } else {
          this.modalPopup.open(SignUpErrorComponent, {
            width: '30%',
            height: '75%',
          });
        }
      }
    );
  }

  getFirstErrorMessage(): string | null {
    const fields = [
      'firstName',
      'lastName',
      'phone',
      'email',
      'password',
      'confirmPassword',
    ];

    for (const field of fields) {
      if (this.isFieldInvalid(field)) {
        return this.getErrorMessage(field);
      }
    }

    if (this.signupForm.hasError('passwordMismatch')) {
      return 'Passwords do not match.';
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.signupForm.get(fieldName);
    return field
      ? field.invalid && (field.touched || field.dirty || this.submitted)
      : false;
  }

  getErrorMessage(fieldName: string): string {
    const field = this.signupForm.get(fieldName);
    if (field) {
      if (field.errors?.['required']) {
        return `${fieldName} is required`;
      }
      if (field.errors?.['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors?.['onlyAlphabets']) {
        return `${fieldName} must contain only alphabets`;
      }
      if (field.errors?.['email']) {
        return 'Invalid email format';
      }
      if (field.errors?.['pattern']) {
        return 'Invalid phone number format';
      }
    }
    return '';
  }
  goToSignIn() {
    console.log('activated');

    if (this.role === 'user') {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['admin/login']);
    }
  }
}
