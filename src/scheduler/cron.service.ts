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

// Делаем уникальный идентификатор состоящий из: ТипШедулера_ID строчки инициатора пуша_DeviceId куда слать пуш

export const startCronJobs = () => {
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
          checkEndContractDate.forEach((contract) => {
            if (contract.property?.user?.devices?.length) {
              contract.property?.user?.devices.forEach(async (device) => {
                await NotificationService.createNotification({
                  body: `Истекает контракт №${contract.contract} по аренде недвижимости ${contract.property.name}`,
                  key: `${ESchedulerType.expiredContracts}_${contract.id}_${device.deviceId}`,
                  userId: contract.property.user.id,
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

  // Проверка на то что пора выставлять счета и присылать счетчики контракты
  cron.schedule(
    // process.env.SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
    process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
    async () => {
      SchedulerLogger.jobStart("[SCHEDULER] start", {
        jobName: ESchedulerType.invoicingTrigger,
        cron: process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
      });
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
            async ({ id, body, token, key, title, propertyId }) => {
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
        await getActiveRents();
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
