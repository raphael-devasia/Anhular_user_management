import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css',
})
export class EditProfileComponent implements OnInit {
  updateUser = inject(AuthService);
  fb = inject(FormBuilder);
  // Variables to hold form data
  editProfileForm!: FormGroup;
  modalPopup = inject(MatDialog);
  data = inject(MAT_DIALOG_DATA)
 
  profileImage: File | null = null;
  profileImageUrl: string | ArrayBuffer | null = '';
  ngOnInit(): void {
    console.log(this.data); // { editUser: true, userId: 'someId' }
    // Initialize the form group
    this.editProfileForm = this.fb.group({
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
      email: [''],
      phone: [''],
    });
    // Fetch user data and populate the form
    // this.updateUser.getUser().subscribe((res: any) => {
    //   console.log(res.user);
    //   this.editProfileForm.patchValue({
    //     firstName: res.user.firstName,
    //     lastName: res.user.lastName,
    //     email: res.user.email,
    //     phone: res.user.phone,
    //   });
    //   // Handle profile image if available
    //   if (res.user.profileImage) {
    //     this.profileImageUrl = `http://localhost:5050/${res.user.profileImage}`;
    //   }
    // });
     if (this.data.editUser) {
      // Pass the userId to getUser method to fetch specific user data
      this.updateUser.getUser(this.data.userId).subscribe((res: any) => {
        console.log(res.user);
        this.editProfileForm.patchValue({
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          email: res.user.email,
          phone: res.user.phone,
        });

        // Handle profile image if available
        if (res.user.profileImage) {
          this.profileImageUrl = `http://localhost:5050/${res.user.profileImage}`;
        }
      });
    } else {
      // Handle the case when editUser is false (fetch data without userId)
      this.updateUser.getUser().subscribe((res: any) => {
        console.log(res.user);
        this.editProfileForm.patchValue({
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          email: res.user.email,
          phone: res.user.phone,
        });

        // Handle profile image if available
        if (res.user.profileImage) {
          this.profileImageUrl = `http://localhost:5050/${res.user.profileImage}`;
        }
      });
    }
  }
 
  // This method will be called when a file is selected
  selectImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('file is available');
      this.profileImage = file;

      // Display image preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  // Form submission logic
  onSubmit(): void {
    const formData = new FormData();

    // Append all form fields to formData, even if they're empty
    Object.keys(this.editProfileForm.value).forEach((key) => {
      formData.append(key, this.editProfileForm.value[key]);
    });

    // Only append the profile image if it exists
    if (this.profileImage) {
      formData.append('profileImage', this.profileImage);
    }

    this.updateUser.updateUser(formData).subscribe(
      (res: any) => {
       this.modalPopup.closeAll()
       window.location.reload();
      },
      (error) => {
        this.modalPopup.closeAll();
        window.location.reload();
      }
    );
  }
  // Validator for allowing only alphabets
  onlyAlphabetsValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return null;
    }
    const valid = /^[a-zA-Z]+$/.test(value);
    return valid ? null : { onlyAlphabets: true };
  }
  getErrorMessage(fieldName: string): string {
    const field = this.editProfileForm.get(fieldName);
    if (field) {
      if (field.errors?.['required']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (field.errors?.['minlength']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${
          field.errors['minlength'].requiredLength
        } characters`;
      }
      if (field.errors?.['onlyAlphabets']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must contain only alphabets`;
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
}
//     this.updateUser.getUser().subscribe((res: any) => {
//       console.log(res.user);
//       this.firstName = res.user.firstName;
//       this.lastName = res.user.lastName;
//       this.email = res.user.email;
//       this.phoneNumber = res.user.phone;

//       this.profileImage = res.user.profileImage;
//     });
//   }

//   // This method will be called when a file is selected
//   selectImage(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       console.log('file is available');

//       this.profileImage = file;

//       // Display image preview
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         this.profileImageUrl = e.target.result;
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   // Form submission logic
//   onSubmit(): void {
//     const formData = new FormData();

//     // Append all form fields to formData, even if they're empty
//     formData.append('firstName', this.firstName);
//     formData.append('lastName', this.lastName);
//     formData.append('email', this.email);
//     formData.append('phone', this.phoneNumber);

//     // Only append the profile image if it exists
//     if (this.profileImage) {
//       formData.append('profileImage', this.profileImage);
//     }

//     // Use FormData.forEach to map key-value pairs into an object

//     this.updateUser.updateUser(formData).subscribe(
//       (res: any) => {
//         console.log('data updated' + res);
//       },
//       (error) => {
//         console.log(error);
//       }
//     );
//   }
// }
