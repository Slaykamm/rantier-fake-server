import { User } from "../entity/user.entity";

export interface IUpdateUserDto
  extends Omit<User, "id" | "email" | "property" | "tgNickname"> {
  tgUsername?: string;
}
