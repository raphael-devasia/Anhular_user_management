import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILogin, IUser, IUserProfile } from '../model/user.medel';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<IUserProfile | null>(null);
  public user$ = this.userSubject.asObservable();

  http = inject(HttpClient);

  registerUser(user: IUser) {
    console.log('The user data is :');

    console.log(user);

    return this.http.post('http://localhost:5050/register', user);
  }
  loginUser(user: ILogin) {
    return this.http.post('http://localhost:5050/login', user, {
      withCredentials: true,
    });
  }
  updateUser(user: any) {
    return this.http.post('http://localhost:5050/updateUser', user, {
      withCredentials: true,
    });
  }
  getUser(id:string = '') {
    return this.http.get('http://localhost:5050/getUser?id', {
      withCredentials: true,
    });
  }
  getAllUsers() {
    return this.http.get('http://localhost:5050/users?getallusers', {
      withCredentials: true,
    });
  }

  
}

