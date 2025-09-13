import { AppDataSource } from "../database/data-source";
import { UserDevices } from "../entity/userDevices.entity";
import { logger } from "../logger/logger";
import { IUserDeviceUpdateDto } from "../models/userDevices.model";
import { getUserByUserId } from "./user.service";

interface ISetSettings {
  req: IUserDeviceUpdateDto;
  userId: string;
}

const userDevicesRepository = AppDataSource.getRepository(UserDevices);

export const updateUserDevice = async (props: ISetSettings) => {
  const { req, userId } = props;
  const { appVersion, deviceId, platform, token, tokenUpdatedAt } = req;
  const user = await getUserByUserId(userId);
  if (user) {
    const foundDevice = await userDevicesRepository.findOneBy({
      userId: user.id,
      deviceId,
    });

    if (!foundDevice) {
      const today = new Date();

      const newIndication = userDevicesRepository.create({
        createAt: today.toISOString(),
        appVersion,
        deviceId,
        userId: user.id,
        platform,
        token,
        tokenUpdatedAt,
      });
      await userDevicesRepository.save(newIndication);
      logger.info("[USER_DEVICES] create", {
        category: "user_devices",
        action: "create",
        userId: user.id,
        deviceId,
        platform,
        appVersion,
        tokenUpdatedAt,
      });
      return {
        success: true,
        data: [newIndication],
        message: "Device created",
      };
    }

    foundDevice.appVersion = appVersion || foundDevice?.appVersion;
    foundDevice.deviceId = deviceId || foundDevice?.deviceId;
    foundDevice.platform = platform || foundDevice?.platform;
    foundDevice.token = token || foundDevice?.token;
    foundDevice.tokenUpdatedAt = tokenUpdatedAt || foundDevice?.tokenUpdatedAt;

    await userDevicesRepository.save(foundDevice);
    logger.info("[USER_DEVICES] update", {
      category: "user_devices",
      action: "update",
      userId: user.id,
      deviceId: foundDevice.deviceId,
      platform: foundDevice.platform,
      appVersion: foundDevice.appVersion,
      tokenUpdatedAt: foundDevice.tokenUpdatedAt,
    });

    return {
      success: true,
      data: [foundDevice],
      message: "Device updated",
    };
  } else {
    return { success: false, message: "No such user found" };
  }
};
