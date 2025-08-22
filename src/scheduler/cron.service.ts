import cron from "node-cron";
import { AppDataSource } from "../database/data-source";
import { Settings } from "../entity/settings.entity";
import { NotificationService } from "../push_notifications/notification.service";

export const startCronJobs = () => {
  // Проверка каждые 10 минут (можно изменить в .env)
  //   cron.schedule(process.env.CRON_SCHEDULE || "*/10 * * * *", async () => {
  cron.schedule("0,10,20,30,40,50 * * * * *", async () => {
    console.log("Запуск cron-задачи: проверка записей...");

    try {
      // Отправка на одно устройство
      // const singleResult = await NotificationService.sendToDevice(
      //   // "device_token_here",
      //   "e8GF9BTCRXyhvZNYrhGegI:APA91bFi0xThCHnyLtBIZf2TtcX5wfgMBDdDbtRHfTZlraQoCIwsFbmNBzBNyKb2eDvdQaz5PQtCT46gey5haD-a76ORcXWxuAaRr41qFDp1KGP94Nq1I1s",
      //   // "fnutpZN4TNeP_wcE3rM3Jg:APA91bGnm68ZuZAVTZY7PdtsuSDYDEAZ2zsRH-gFeA97DArGl5pemUz6GdqseZ52U3Z7CrcNA0OEdRVpWDfq49Nx63QoW3iKU_sRCPQbQeJwdxWk04tX6yU",
      //   {
      //     title: "Привет!",
      //     body: "Это тестовое уведомление",
      //   },
      //   {
      //     key: "value",
      //   }
      // );
      console.log("Single message sent:"); //singleResult
    } catch (e) {
      if (e instanceof Error) console.log("ERRRROR", e.message);
    }

    // const recordRepository = AppDataSource.getRepository(Settings);
    // const settings = await recordRepository.find();

    // console.log("CRON", settings);

    // for (const record of records) {
    //     try {
    //         await sendEmail({
    //             to: record.email,
    //             subject: 'Уведомление',
    //             text: `Привет, ${record.name}! Твой статус требует внимания.`,
    //         });

    //         // Помечаем запись как обработанную
    //         record.notified = true;
    //         await recordRepository.save(record);

    //         console.log(`Email отправлен: ${record.email}`);
    //     } catch (err) {
    //         console.error(`Ошибка при отправке email для ${record.email}:`, err);
    //     }
    // }
  });
};
