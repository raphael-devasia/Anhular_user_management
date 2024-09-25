import { Component, inject } from '@angular/core';
import { SignupSuccessComponent } from '../../signUpSuccess/signup-success/signup-success.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-sign-up-error',
  standalone: true,
  imports: [],
  templateUrl: './sign-up-error.component.html',
  styleUrl: './sign-up-error.component.css',
})
export class SignUpErrorComponent {
  constructor(public dialogRef: MatDialogRef<SignupSuccessComponent>) {}
  closeDialog() {
    this.dialogRef.close()
  }
}
