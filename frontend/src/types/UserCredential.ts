export interface UserCredential {
  email: string;
  password: string;
}

export interface IUpdatePassword {
  userId: string;
  password: string
}