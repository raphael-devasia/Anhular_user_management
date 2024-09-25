
import { Component, inject, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../../navbar/navbar.component';
import { IUserProfile } from '../../model/user.medel';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  toastr = inject(ToastrService)
  userData = inject(AuthService)
  store = inject(Store)
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

   const user = res.user;
   
   this.user = { ...user, image: `http://localhost:5050/${user.profileImage}` };


   
  this.user.firstName = res.user.firstName
  this.user.lastName = res.user.lastName;
  this.user.email = res.user.email;
  this.user.phone = res.user.phone;
  this.user.image = `http://localhost:5050/${res.user.profileImage}`;
  const hasShownToastr = localStorage.getItem('hasShownToastr');

  if (!hasShownToastr) {
    // Show the toast only if it hasn't been shown before
    this.toastr.show(`Welcome ${this.user.firstName}`);

    // Set a flag in localStorage to indicate that the toast has been shown
    localStorage.setItem('hasShownToastr', 'true');
  }


  
})

    
  }
}
