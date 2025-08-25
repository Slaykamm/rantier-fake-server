import cron from "node-cron";
import { expiredContracts, invoicingContacts } from "../services/rent.service";
import { ESchedulerType } from "../consts/scheduler_enum";
import * as NotificationService from "../services/notifications.service";
import { getActualNotifications } from "../services/notifications.service";
import { PushNotificationService } from "../push_notifications/notification.service";

// Делаем уникальный идентификатор состоящий из: ТипШедулера_ID строчки инициатора пуша_DeviceId куда слать пуш

export const startCronJobs = () => {
  cron.schedule(
    process.env.SCHEDULE_PAYMENT_REMIDER || "0 12 * * *",
    async () => {
      console.log(
        "Запуск cron-задачи: проверка истекающих через 5 дней контрактов..."
      );
      // Проверка на итекающие контракты
      try {
        const checkEndContractDate = await expiredContracts();
        if (checkEndContractDate?.length) {
          checkEndContractDate.forEach((contract) => {
            if (contract.property?.user?.devices?.length) {
              contract.property?.user?.devices.forEach(async (device) => {
                await NotificationService.createNotification({
                  body: `Истекает контракт №${contract.contract} по аренде недвижимости ${contract.property.name}`,
                  key: `${ESchedulerType.expiredContracts}_${contract.id}_${device.deviceId}`,
                  userId: contract.property.user.id,
                  isError: false,
                  title: "Контракт аренды истекает",
                  token: device.token || "",
                });
              });
            }
          });
        }
      } catch (e) {
        if (e instanceof Error)
          console.log("Ошибка провери истекающих договор аренды", e.message);
      }
    }
  );

  // Проверка на то что пора выставлять счета и присылать счетчики контракты
  cron.schedule(
    process.env.SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
    async () => {
      console.log(
        "Запуск cron-задачи: проверка времени подачи данных о счетчиков и выставлять счета..."
      );
      // Проверка на итекающие контракты
      try {
        const getNeedToInvoicedContracts = await invoicingContacts();
        if (getNeedToInvoicedContracts?.length) {
          getNeedToInvoicedContracts.forEach((contract) => {
            if (contract.property?.user?.devices?.length) {
              contract.property?.user?.devices.forEach(async (device) => {
                if (!!device.token) {
                  await NotificationService.createNotification({
                    body: `По контракту №${contract.contract} по аренде недвижимости ${contract.property.name} пора запросить счетчики для выставления счетов`,
                    isError: false,
                    key: `${ESchedulerType.invoicingTrigger}_${contract.id}_${device.deviceId}`,
                    userId: contract.property.user.id,
                    title: "Запросить счетчики",
                    token: device.token || "",
                  });
                }
              });
            }
          });
        }
      } catch (e) {
        if (e instanceof Error)
          console.log(
            "Ошибка времени подачи данных о счетчиков и выставлять счета",
            e.message
          );
      }
    }
  );

  //  шедулер для отправки пушей из БД нотификейшнс
  cron.schedule(
    process.env.SCHEDULE_NOTIFICATION_SERVICE || "1 * * * *",
    async () => {
      console.log("Запуск cron-задачи: отправка пуш уведомлений");
      try {
        const actualNotifications = await getActualNotifications();
        console.log("test actualNotifications", actualNotifications);
        if (actualNotifications?.length) {
          actualNotifications.forEach(
            async ({ id, body, token, key, title }) => {
              try {
                await PushNotificationService.sendToDevice(
                  token || "",
                  {
                    title: title || "",
                    body: body || "",
                  },
                  {
                    key: key || "",
                  }
                );

                await NotificationService.setSuccessExecutedFlag(id);
              } catch (e) {
                if (e instanceof Error) {
                  console.log(
                    `Ошибка в отправке пуш уведомления на пуше ${id}`,
                    e.message
                  );
                  await NotificationService.setErrorExecutedFlag(id);
                }
              }
            }
          );
        }
      } catch (e) {
        if (e instanceof Error)
          console.log(`Ошибка в сервисе отправки пуш уведомлений`, e.message);
      }

      // TODO
      // написать шедулер добавления в БД на отправку через емаил
      // написать шедулер добавления в БД на отправку через телеграмм
    }
  );
};
