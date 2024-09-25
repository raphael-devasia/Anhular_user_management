

export interface IUser {
  _id?:string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
  image?: string;
  token?: string;
  profileImage?:string;
}

export interface ILogin {
  email: string;
  password: string;
  role?:string
}

export interface IUserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  image?: string;
  profileImage?: string;
  profileImageUrl?:string;
}