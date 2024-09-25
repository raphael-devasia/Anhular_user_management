import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditProfileComponent } from '../profile/edit-profile/edit-profile.component';
import { IUserProfile } from '../model/user.medel';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  
  isProfileOpen: boolean = false;
  modalPopup = inject(MatDialog);
  userData = inject(AuthService)
  user:IUserProfile = {
    firstName:'',
    lastName:'',
    email:"",
    phone:'',
    image:''
  }
  ngOnInit(): void {
this.userData.getUser().subscribe((res:any)=>{
  console.log(res);
  this.user.firstName = res.user.firstName
  this.user.lastName = res.user.lastName;
  this.user.email = res.user.email;
  this.user.phone = res.user.phone;
  this.user.image = `http://localhost:5050/${res.user.profileImage}`;
  
})}

  openUser() {
    this.isProfileOpen = !this.isProfileOpen;
  }
  editUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px'; // Set width according to your layout
    dialogConfig.height = 'auto'; // Auto-adjust height
    dialogConfig.maxWidth = '40vw'; // Ensure it doesn't exceed the viewport width on small screens
    dialogConfig.panelClass = 'custom-dialog'; // Optional: Custom styling for the dialog

    this.modalPopup.open(EditProfileComponent, dialogConfig);
  }
  signOut(){
    localStorage.removeItem('jwt')
    localStorage.removeItem('hasShownToastr');
    window.location.reload();
  }
}
