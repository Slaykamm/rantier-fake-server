import admin from "firebase-admin";
import { logger } from "../logger/logger";

type NotificationPayload = {
  title: string;
  body: string;
  imageUrl?: string;
};

type MessageData = Record<string, string>;

export class PushNotificationService {
  /**
   * Отправка уведомления на одно устройство
   */
  static async sendToDevice(
    token: string,
    notification: NotificationPayload,
    data?: MessageData,
    options?: admin.messaging.MessagingOptions
  ): Promise<string> {
    const message: admin.messaging.Message = {
      token,
      notification,
      data,
      ...options,
    };

    const key = data?.key;
    const deviceId = typeof key === "string" ? key.split("_").pop() : undefined;
    const notificationId = data?.notificationId;
    const mask = (t: string) => (t ? `${t.slice(0, 6)}...${t.slice(-4)}` : "");

    try {
      const messageId = await admin.messaging().send(message);
      logger.info("[PUSH] send.success", {
        category: "push",
        deviceId: deviceId || null,
        token: mask(token),
        at: new Date().toISOString(),
        messageId,
        notificationId: notificationId || null,
      });
      return messageId;
    } catch (e) {
      const err = e as Error;
      logger.error("[PUSH] send.error", {
        category: "push",
        deviceId: deviceId || null,
        token: mask(token),
        at: new Date().toISOString(),
        error: err.message,
        notificationId: notificationId || null,
      });
      throw e;
    }
  }

  //   /**
  //    * Отправка уведомления на несколько устройств
  //    */
  //   static async sendToDevices(
  //     tokens: string[],
  //     notification: NotificationPayload,
  //     data?: MessageData,
  //     options?: admin.messaging.MessagingOptions
  //   ): Promise<admin.messaging.BatchResponse> {
  //     const message: admin.messaging.MulticastMessage = {
  //       tokens,
  //       notification,
  //       data,
  //       ...options,
  //     };

  //     return admin.messaging().sendMulticast(message);
  //   }

  /**
   * Отправка уведомления по теме
   */
  static async sendToTopic(
    topic: string,
    notification: NotificationPayload,
    data?: MessageData,
    options?: admin.messaging.MessagingOptions
  ): Promise<string> {
    const message: admin.messaging.Message = {
      topic,
      notification,
      data,
      ...options,
    };

    return admin.messaging().send(message);
  }

  /**
   * Подписка устройств на тему
   */
  static async subscribeToTopic(
    tokens: string[],
    topic: string
  ): Promise<admin.messaging.MessagingTopicManagementResponse> {
    return admin.messaging().subscribeToTopic(tokens, topic);
  }

  /**
   * Отписка устройств от темы
   */
  static async unsubscribeFromTopic(
    tokens: string[],
    topic: string
  ): Promise<admin.messaging.MessagingTopicManagementResponse> {
    return admin.messaging().unsubscribeFromTopic(tokens, topic);
  }
}
