import admin from "firebase-admin";

type NotificationPayload = {
  title: string;
  body: string;
  imageUrl?: string;
};

type MessageData = Record<string, string>;

export class NotificationService {
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

    return admin.messaging().send(message);
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
