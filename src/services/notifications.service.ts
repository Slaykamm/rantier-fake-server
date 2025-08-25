import { AppDataSource } from "../database/data-source";
import { Notifications } from "../entity/notifications.entity";
import { Settings } from "../entity/settings.entity";

const notificationsRepository = AppDataSource.getRepository(Notifications);

const getAllSettings = AppDataSource.getRepository(Settings);

interface INotificationsCreate
  extends Omit<Notifications, "id" | "createAt" | "isExecuted" | "user"> {}

export const createNotification = async (request: INotificationsCreate) => {
  const { body, key, title, token } = request;

  const presentNofitication = await notificationsRepository.find({
    where: {
      key,
      isExecuted: false,
    },
  });

  if (presentNofitication?.length) {
    return { success: false };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Обнуляем часы, минуты, секунды, миллисекунды

  const newNotification = notificationsRepository.create({
    body,
    key,
    title,
    token,
    isExecuted: false,
    createAt: today.toString(),
  });
  await notificationsRepository.save(newNotification);
  return { success: true };
};

export const getActualNotifications = async () => {
  const actualNotifications = await notificationsRepository.find({
    where: { isExecuted: false },
  });

  const permittedNotificationsUsers = await getAllSettings.find({
    where: { notification_service: false },
  });

  const userIds = permittedNotificationsUsers.map((user) => user.id);

  const filteredNofiticationsToSend = actualNotifications.filter(
    (notification) => !userIds?.includes(notification.userId)
  );

  return filteredNofiticationsToSend;
};

export const setSuccessExecutedFlag = async (id: number) => {
  const targetNotification = await notificationsRepository.findOneBy({ id });
  if (!targetNotification) {
    return;
  }
  targetNotification.isExecuted = true;

  await notificationsRepository.save(targetNotification);
};

export const setErrorExecutedFlag = async (id: number) => {
  const targetNotification = await notificationsRepository.findOneBy({ id });
  if (!targetNotification) {
    return;
  }
  targetNotification.isExecuted = true;
  targetNotification.isError = true;

  await notificationsRepository.save(targetNotification);
};
