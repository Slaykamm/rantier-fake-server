import cron from "node-cron";
import {
  expiredContracts,
  getActiveRents,
  invoicingContacts,
} from "../services/rent.service";
import { ESchedulerType } from "../consts/scheduler_enum";
import * as NotificationService from "../services/notifications.service";
import { getActualNotifications } from "../services/notifications.service";
import { PushNotificationService } from "../push_notifications/notification.service";
import { SchedulerLogger } from "../logger/schedulerLogger";
import { getSettingValueByName } from "../services/settings.service";
import { ESettingsServiceNames } from "../consts/settings_enum";

// Делаем уникальный идентификатор состоящий из: ТипШедулера_ID строчки инициатора пуша_DeviceId куда слать пуш

export const startCronJobs = () => {
  // Шедулер для отправки нотификейшенов для истекающиих контрактов. Проверяет что осталось <= 5 дней до истечения контракта.
  cron.schedule(
    // process.env.SCHEDULE_PAYMENT_REMIDER || "0 12 * * *",
    process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "0 12 * * *",
    async () => {
      SchedulerLogger.jobStart("[SCHEDULER] start", {
        jobName: ESchedulerType.expiredContracts,
        cron: process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "0 12 * * *",
      });
      // Проверка на итекающие контракты
      try {
        const checkEndContractDate = await expiredContracts();
        if (checkEndContractDate?.length) {
          checkEndContractDate.forEach(async (contract) => {
            // Проверяем что нотификейш сервис активен
            const notificationData = await getSettingValueByName({
              settingName: ESettingsServiceNames.NOTIFICATION_SERVICE,
              user_Id: contract.property.userId,
            });
            const isNotificationActive = !!notificationData.data;
            if (
              contract.property?.user?.devices?.length &&
              !!isNotificationActive
            ) {
              contract.property?.user?.devices.forEach(async (device) => {
                await NotificationService.createNotification({
                  body: `Истекает контракт №${contract.contract} по аренде недвижимости ${contract.property.name}`,
                  key: `${ESchedulerType.expiredContracts}_${contract.id}_${device.deviceId}`,
                  userId: contract.property.userId,
                  propertyId: contract.propertyId,
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
          SchedulerLogger.jobError("[SCHEDULER] error", e, {
            jobName: ESchedulerType.expiredContracts,
            scope: "expiredContracts",
          });
      }
    }
  );

  // Проверка  за 3 дня на то что присылать счетчики для выставления счетов
  cron.schedule(
    process.env.SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
    // process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
    async () => {
      SchedulerLogger.jobStart("[SCHEDULER] start", {
        jobName: ESchedulerType.invoicingTrigger,
        cron: process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
      });
      try {
        // TODO Добавить слайдер для выбора кол-ва дней за сколько запрашивать счетчики
        const getNeedToInvoicedContracts = await invoicingContacts();
        if (getNeedToInvoicedContracts?.length) {
          getNeedToInvoicedContracts.forEach(async (contract) => {
            // Проверяем что нотификейш сервис активен
            const notificationData = await getSettingValueByName({
              settingName: ESettingsServiceNames.NOTIFICATION_SERVICE,
              user_Id: contract.property.userId,
            });
            const isNotificationActive = !!notificationData.data;
            if (
              contract.property?.user?.devices?.length &&
              isNotificationActive
            ) {
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
          SchedulerLogger.jobError("[SCHEDULER] error", e, {
            jobName: ESchedulerType.invoicingTrigger,
            scope: "invoicingTrigger",
          });
      }
    }
  );

  //  шедулер для отправки пушей из БД нотификейшнс
  cron.schedule(
    process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "1 * * * *",
    // process.env.SCHEDULE_NOTIFICATION_SERVICE || "1 * * * *",
    async () => {
      SchedulerLogger.jobStart("[SCHEDULER] start", {
        jobName: "push_notifications_sender",
        cron: process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "1 * * * *",
      });
      try {
        const actualNotifications = await getActualNotifications();
        if (actualNotifications?.length) {
          actualNotifications.forEach(
            async ({ id, body, token, key, title, propertyId, userId }) => {
              const notificationData = await getSettingValueByName({
                settingName: ESettingsServiceNames.NOTIFICATION_SERVICE,
                user_Id: userId,
              });
              const isNotificationActive = !!notificationData.data;

              if (!!isNotificationActive) {
                try {
                  await PushNotificationService.sendToDevice(
                    token || "",
                    {
                      title: title || "",
                      body: body || "",
                    },
                    {
                      key: key || "",
                      notificationId: String(id),
                      propertyId: String(propertyId),
                    }
                  );

                  await NotificationService.setSuccessExecutedFlag(id);
                } catch (e) {
                  if (e instanceof Error) {
                    SchedulerLogger.jobError("[SCHEDULER] error", e, {
                      jobName: "push_notifications_sender",
                      id,
                      scope: "push_send",
                    });
                    await NotificationService.setErrorExecutedFlag(id);
                  }
                }
              }
            }
          );
        }
      } catch (e) {
        if (e instanceof Error)
          SchedulerLogger.jobError("[SCHEDULER] error", e, {
            jobName: "push_notifications_sender",
            scope: "push_service",
          });
      }

      // TODO
      // написать шедулер добавления в БД на отправку через емаил
      // написать шедулер добавления в БД на отправку через телеграмм
    }
  );

  // Шедулер для закрытие контрактов аренды с закончившейся датой.
  // ДОБАВИТЬ ДЖОБ ЧТОБЫ ВЫСЫЛАЛ Notification
  cron.schedule(
    process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "16 0 * * *",
    // process.env.SCHEDULE_DEACTIVATE_CONTRACT || "16 0 * * *",
    async () => {
      SchedulerLogger.jobStart("[SCHEDULER] start", {
        jobName: "deactivate_expired_contracts",
        cron: process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "16 0 * * *",
      });
      // Проверка на истекашие контракты
      try {
        const contractsToClose = await getActiveRents();
        // TODO Сделать тут добавление в сервис пушей на отправку.
        // contractsToClose[0].property.userId
      } catch (e) {
        if (e instanceof Error)
          SchedulerLogger.jobError("[SCHEDULER] error", e, {
            jobName: "deactivate_expired_contracts",
            scope: "deactivate_contracts",
          });
      }
    }
  );
};
