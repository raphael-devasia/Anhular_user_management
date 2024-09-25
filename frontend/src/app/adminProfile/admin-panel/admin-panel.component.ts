import { Component, inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../../auth/signup/signup/signup.component';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../model/user.medel';
import { CommonModule } from '@angular/common';
import { EditProfileComponent } from '../../profile/edit-profile/edit-profile.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [SignupComponent, CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css',
})
export class AdminPanelComponent implements OnInit {
  modalPopup = inject(MatDialog);
  userDetails = inject(AuthService);
  operation: string = 'adduser';

  users: IUser[] = [];
  addUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '600px'; // Set width according to your layout
    dialogConfig.height = 'auto'; // Auto-adjust height
    dialogConfig.maxWidth = '40vw'; // Ensure it doesn't exceed the viewport width on small screens
    dialogConfig.panelClass = 'custom-dialog'; // Optional: Custom styling for the dialog
    dialogConfig.data = { operation: this.operation };

    this.modalPopup.open(SignupComponent, dialogConfig);
  }
  editUser(id:any){
const dialogConfig = new MatDialogConfig();
dialogConfig.width = '600px'; // Set width according to your layout
dialogConfig.height = 'auto'; // Auto-adjust height
dialogConfig.maxWidth = '40vw'; // Ensure it doesn't exceed the viewport width on small screens
dialogConfig.panelClass = 'custom-dialog'; // Optional: Custom styling for the dialog
dialogConfig.data = { editUser: true, userId: id };

this.modalPopup.open(EditProfileComponent, dialogConfig);
  }
  ngOnInit(): void {
    this.userDetails.getAllUsers().subscribe((res: any) => {
      this.users = res.user;
      console.log(this.users);
    });
  }
}
