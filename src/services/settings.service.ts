import { AppDataSource } from "../database/data-source";
import { Settings } from "../entity/settings.entity";
import { ISetSettingsDto } from "../models/settings.model";
import { getUserByUserId } from "./user.service";

const settingsRepository = AppDataSource.getRepository(Settings);

//

export const getSettings = async (userId: string) => {
  const user = await getUserByUserId(userId);
  if (user) {
    const respData = await settingsRepository.find({
      where: { userId: user.id },
    });
    return { success: true, data: respData };
  }
  return { success: false, message: "No such user found" };
};

interface ISetSettings {
  req: ISetSettingsDto;
  userId: string;
}

export const setSettings = async (props: ISetSettings) => {
  const { req, userId } = props;
  console.log("test req", req);
  const {
    auto_invoicing,
    counter_reminder,
    email,
    notification_service,
    payment_reminder,
    telegramm,
  } = req;
  const user = await getUserByUserId(userId);
  if (user) {
    const respData = await settingsRepository.findOneBy({
      userId: user.id,
    });

    if (!respData) {
      return { success: false, message: "No settings for user found" };
    }

    respData.auto_invoicing = auto_invoicing || respData?.auto_invoicing;
    respData.counter_reminder = counter_reminder || respData?.counter_reminder;
    respData.email = email || respData?.email;
    respData.notification_service =
      notification_service || respData?.notification_service;
    respData.payment_reminder = payment_reminder || respData?.payment_reminder;
    respData.telegramm = telegramm || respData?.telegramm;

    await settingsRepository.save(respData);

    return { success: true };
  } else {
    return { success: false, message: "No such user found" };
  }
};
