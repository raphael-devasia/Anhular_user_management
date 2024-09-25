import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ILogin } from '../../../model/user.medel';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  role: string = 'user';
  loginService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  submitted = false;
  toastr = inject(ToastrService);
  store = inject(Store);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  ngOnInit(): void {
    const currentUrl = this.router.url;
    if (currentUrl.includes('/admin/login')) {
      this.role = 'admin';
    } else if (currentUrl.includes('/login')) {
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
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }
  loginFormSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const user: ILogin = { ...this.loginForm.value, role: this.role };

    this.loginService.loginUser(user).subscribe(
      (res: any) => {
        console.log(res.token);
        if (this.role === 'user') {
          localStorage.setItem('jwt', res.token);
          this.loginForm.reset();

          this.router.navigate(['profile']);
        }
        if (this.role === 'admin') {
          localStorage.setItem('adminToken', res.token);
          this.loginForm.reset();

          this.router.navigate(['admin/profile']);
        }
      },
      (error) => {
        this.loginForm.controls['password'].reset();
        this.toastr.show(error.error.message);
      }
    );
  }
  getFirstErrorMessage(): string | null {
    const fields = ['email', 'password'];

    for (const field of fields) {
      if (this.isFieldInvalid(field)) {
        return this.getErrorMessage(field);
      }
    }

    return null;
  }
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field
      ? field.invalid && (field.touched || field.dirty || this.submitted)
      : false;
  }
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
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
  goToSignup(){
    console.log('activated');
    
     if (this.role === 'user'){
      this.router.navigate(['signup']);
     }
     else{
      this.router.navigate(['admin/signup']);
     }
  }
}
