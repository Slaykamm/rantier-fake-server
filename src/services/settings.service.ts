import { ESettingsServiceNames } from "../consts/settings_enum";
import { AppDataSource } from "../database/data-source";
import { Settings } from "../entity/settings.entity";
import { ISetSettingsDto } from "../models/settings.model";
import { getUserById, getUserByUserId } from "./user.service";

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

    respData.auto_invoicing = auto_invoicing || false;
    respData.counter_reminder = counter_reminder || false;
    respData.email = email || false;
    respData.notification_service = notification_service || false;
    respData.payment_reminder = payment_reminder || false;
    respData.telegramm = telegramm || false;
    await settingsRepository.save(respData);

    return { success: true };
  } else {
    return { success: false, message: "No such user found" };
  }
};

export const getSettingValueByName = async ({
  user_Id,
  settingName,
}: {
  user_Id: number;
  settingName: ESettingsServiceNames;
}) => {
  const respData = await settingsRepository.findOne({
    where: { userId: user_Id },
  });
  return { success: true, data: respData?.[settingName] };
};
