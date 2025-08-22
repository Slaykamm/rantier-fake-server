import { UserDevices } from "../entity/userDevices.entity";

export interface IUserDeviceUpdateDto
  extends Omit<UserDevices, "id" | "createAt" | "userId" | "user"> {}
