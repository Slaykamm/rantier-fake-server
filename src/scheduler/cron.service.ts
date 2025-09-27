import cron from "node-cron";
import {
  expiredContractsByUserId,
  getActiveRents,
  counterRemindContracts,
  counterRemindContractsByUserId,
  getRequestPaymentContractsByUserId,
} from "../services/rent.service";
import { ESchedulerType } from "../consts/scheduler_enum";
import * as NotificationService from "../services/notifications.service";
import { getActualNotifications } from "../services/notifications.service";
import { PushNotificationService } from "../push_notifications/notification.service";
import { SchedulerLogger } from "../logger/schedulerLogger";
import {
  getAllSettings,
  getSettingValueByName,
} from "../services/settings.service";
import { ESettingsServiceNames } from "../consts/settings_enum";
import { getAutoInvoiingContractsByUserId } from "../services/transactions.service";

// Делаем уникальный идентификатор состоящий из: ТипШедулера_ID строчки инициатора пуша_DeviceId куда слать пуш

export const startCronJobs = () => {
  // INTERACTIVE ШЕДУЛЕРЫ
  // +Шедулер для отправки нотификейшенов для истекающиих контрактов. Проверяет что осталось <= 5 дней до истечения контракта.
  cron.schedule(
    // process.env.SCHEDULE_PAYMENT_REMIDER || "0 12 * * *",
    process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "0 12 * * *",
    async () => {
      SchedulerLogger.jobStart("[SCHEDULER] start", {
        jobName: ESchedulerType.expireContractTrigger,
        cron: process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "0 12 * * *",
      });
      try {
        const allSettings = await getAllSettings();
        if (!allSettings) return;
        allSettings.forEach(async (setting) => {
          const { contractExpiredDays, isContractExpired } = setting;

          if (isContractExpired) {
            const expiredContracts = await expiredContractsByUserId({
              days: contractExpiredDays,
              userId: setting.userId,
            });
            if (expiredContracts?.length) {
              expiredContracts.forEach(async (contract) => {
                if (contract.property?.user?.devices?.length) {
                  contract.property?.user?.devices.forEach(async (device) => {
                    await NotificationService.createNotification({
                      body: `Истекает контракт №${contract.contract} по аренде недвижимости ${contract.property.name}`,
                      key: `${ESchedulerType.expireContractTrigger}_${contract.id}_${device.deviceId}`,
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
          }
        });
      } catch (e) {
        if (e instanceof Error)
          SchedulerLogger.jobError("[SCHEDULER] error", e, {
            jobName: ESchedulerType.expireContractTrigger,
            scope: "expireContractTrigger",
          });
      }
    }
  );

  // Шедулер на то что надо запросить прислать счетчики для выставления счетов
  cron.schedule(
    process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
    // process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
    async () => {
      SchedulerLogger.jobStart("[SCHEDULER] start", {
        jobName: ESchedulerType.requestcountersTrigger,
        cron: process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
      });
      try {
        const allSettings = await getAllSettings();
        if (!allSettings) return;
        allSettings.forEach(async (setting) => {
          const {
            counterReminderDays,
            isCounterReminder,
            emailService,
            telegrammService,
          } = setting;

          if (!emailService && !telegrammService && !!isCounterReminder) {
            const getNeedToRequestCountersContracts =
              await counterRemindContractsByUserId({
                userId: setting.userId,
                days: counterReminderDays,
              });

            if (!!getNeedToRequestCountersContracts?.length) {
              getNeedToRequestCountersContracts.forEach(async (contract) => {
                if (contract.property?.user?.devices?.length) {
                  contract.property?.user?.devices.forEach(async (device) => {
                    if (!!device.token) {
                      await NotificationService.createNotification({
                        body: `По контракту №${contract.contract} по аренде недвижимости ${contract.property.name} пора запросить счетчики для выставления счетов`,
                        isError: false,
                        key: `${ESchedulerType.requestcountersTrigger}_${contract.id}_${device.deviceId}`,
                        propertyId: contract.propertyId,
                        userId: contract.property.user.id,
                        title: "Запросить счетчики",
                        token: device.token || "",
                      });
                    }
                  });
                }
              });
            }
          }
        });
      } catch (e) {
        if (e instanceof Error)
          SchedulerLogger.jobError("[SCHEDULER] error", e, {
            jobName: ESchedulerType.requestcountersTrigger,
            scope: "requestcountersTrigger",
          });
      }
    }
  );

  // Шедулер на Напоминание выставить счета за аренду
  cron.schedule(
    process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
    async () => {
      SchedulerLogger.jobStart("[SCHEDULER] start", {
        jobName: ESchedulerType.createInvoiceTrigger,
        cron: process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
      });
      try {
        const allSettings = await getAllSettings();
        if (!allSettings) return;
        allSettings.forEach(async (setting) => {
          const { requestPaymentRemindDays, isRequestPaymentRemind } = setting;

          if (!!isRequestPaymentRemind) {
            const getNeedToRequestPaymentContracts =
              await getRequestPaymentContractsByUserId({
                userId: setting.userId,
                days: requestPaymentRemindDays,
              });

            if (!!getNeedToRequestPaymentContracts?.length) {
              getNeedToRequestPaymentContracts.forEach(async (contract) => {
                if (contract.property?.user?.devices?.length) {
                  contract.property?.user?.devices.forEach(async (device) => {
                    if (!!device.token) {
                      await NotificationService.createNotification({
                        body: `По контракту №${contract.contract} по аренде недвижимости ${contract.property.name} необходимо выставить счет`,
                        isError: false,
                        key: `${ESchedulerType.createInvoiceTrigger}_${contract.id}_${device.deviceId}`,
                        propertyId: contract.propertyId,
                        userId: contract.property.user.id,
                        title: "Получить оплату",
                        token: device.token || "",
                      });
                    }
                  });
                }
              });
            }
          }
        });
      } catch (e) {
        if (e instanceof Error)
          SchedulerLogger.jobError("[SCHEDULER] error", e, {
            jobName: ESchedulerType.createInvoiceTrigger,
            scope: "createInvoiceTrigger",
          });
      }
    }
  );

  // Шедулер 1. Создает счет на оплату за актуальный период, если не был создан еще счет. 2. Берет общий баланс и высылает арендатору.
  cron.schedule(
    process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
    async () => {
      SchedulerLogger.jobStart("[SCHEDULER] start", {
        jobName: ESchedulerType.autoinvoicingTrigger,
        cron: process.env.TEST_SCHEDULE_COUNTERS_REMIDNER || "* 11 * * *",
      });
      try {
        const allSettings = await getAllSettings();
        if (!allSettings) return;
        allSettings.forEach(async (setting) => {
          const { autoInvoicingDays, isAutoInvoicing } = setting;

          if (!!isAutoInvoicing) {
            const contractToAutoInvoicing =
              await getAutoInvoiingContractsByUserId({
                userId: setting.userId,
                days: autoInvoicingDays,
              });

            if (!!contractToAutoInvoicing?.length) {
              contractToAutoInvoicing.forEach(async (invoicedContract) => {
                const { contract, message } = invoicedContract || {};
                if (contract.property?.user?.devices?.length) {
                  contract.property?.user?.devices.forEach(async (device) => {
                    if (!!device.token) {
                      await NotificationService.createNotification({
                        body: message,
                        isError: false,
                        key: `${ESchedulerType.autoinvoicingTrigger}_${contract.id}_${device.deviceId}`,
                        propertyId: contract.propertyId,
                        userId: contract.property.user.id,
                        title: "Выставлены счета",
                        token: device.token || "",
                      });
                    }
                  });
                }
              });
            }
          }
        });
      } catch (e) {
        if (e instanceof Error)
          SchedulerLogger.jobError("[SCHEDULER] error", e, {
            jobName: ESchedulerType.autoinvoicingTrigger,
            scope: "autoinvoicingTrigger",
          });
      }
    }
  );

  // SERVICE ШЕДУЛЕРЫ
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
  // TODO ДОБАВИТЬ ДЖОБ ЧТОБЫ ВЫСЫЛАЛ Notification
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
