import { User } from "./User";

export interface UserUpdate {
  id: number | string;
  update: Omit<User, "id">;
}
