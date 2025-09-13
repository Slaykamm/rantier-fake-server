import { AppDataSource } from "./database/data-source";
import counterRouter from "./routes/counter.routes";
import indicationsRouter from "./routes/indications.routes";
import propertyRouter from "./routes/property.routes";
import rentRouter from "./routes/rent.routes";
import tenantRouter from "./routes/tenant.routes";
import transactionRouter from "./routes/transactions.routes";
import admin from "firebase-admin";
import express, { Request, Response } from "express";
import userRouter from "./routes/user.routes";
import cors from "cors";
import path from "path";
import "dotenv/config";
import settingsRouter from "./routes/settings.routes";
import { startCronJobs } from "./scheduler/cron.service";
import userDevicesRouter from "./routes/userdevices.routes";
import { apiLogger as apiRequestLogger } from "./logger/apiLogger";
const serviceAccount = require("../firebase-adminsdk.json");

// Type declarations
declare global {
  namespace Express {
    interface Request {
      user?: admin.auth.DecodedIdToken;
      file?: Express.Multer.File;
    }
  }
}

// Импортируем необходимые модули
// const express = require("express");
const app = express();
const port = 3000;

// const service_company = require("../mocks/service_company.json");

admin.initializeApp({
  // @ts-ignore
  credential: admin.credential.cert(serviceAccount),
});

// Middleware для обработки JSON-запросов
app.use(cors());
app.use(express.json());
app.use(apiRequestLogger);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    startCronJobs(); // Запуск задач по расписанию

    // Обработка GET-запроса на корневой путь
    app.get("/", (req: Request, res: Response) => {
      AppDataSource.createQueryBuilder();

      // @ts-ignore
      res.send("Привет, это простой сервер на Express!");
    });

    // // COUNTERS

    app.use("/counter", counterRouter);

    // INDICATORS
    app.use("/indications", indicationsRouter);

    // USER
    app.use("/user", userRouter);

    // PROPERTY
    app.use("/property", propertyRouter);

    // RENT
    app.use("/rent", rentRouter);

    // TENANT
    app.use("/tenant", tenantRouter);

    // TRANSACTIONS
    app.use("/transactions", transactionRouter);

    // SETTINGS
    app.use("/settings", settingsRouter);

    // USER_DEVICES
    app.use("/userDevices", userDevicesRouter);

    // Запуск сервера
    app.listen(port, () => {
      console.log(`Сервер запущен на http://localhost:${port}`);
    });
  })
  .catch((error) => console.log("Database connection error:", error));

// Cleanup on exit
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  process.exit(0);
});
