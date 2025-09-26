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
  req: Omit<Settings, "id" | "userId">; //ISetSettingsDto;
  userId: string;
}

export const setSettings = async (props: ISetSettings) => {
  const { req, userId } = props;
  const {
    emailService,
    telegrammService,
    notificationService,

    isContractExpired,
    contractExpiredDays,

    isAutoInvoicing,
    autoInvoicingDays,

    isCounterReminder,
    counterReminderDays,

    isPaymentReminder,
    paymentReminderDays,

    isRequestPaymentRemind,
    requestPaymentRemindDays,
  } = req;
  const user = await getUserByUserId(userId);
  if (user) {
    const respData = await settingsRepository.findOneBy({
      userId: user.id,
    });

    if (!respData) {
      return { success: false, message: "No settings for user found" };
    }

    await settingsRepository.update(respData.id, req);

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
