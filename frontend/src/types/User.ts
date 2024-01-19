export enum userRoleEnum {
  Customer = "Customer",
  Admin = "Admin",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: userRoleEnum;
  avatar: string;
  address: string;
  password?: string;
}

export interface NewUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatar: string;
  address: string;
  password?: string;
}
