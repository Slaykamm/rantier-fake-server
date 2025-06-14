import { AppDataSource } from "./database/data-source";
import counterRouter from "./routes/counter.routes";
import indicationsRouter from "./routes/indications.routes";
import propertyRouter from "./routes/property.routes";
import rentRouter from "./routes/rent.routes";
import tenantRouter from "./routes/tenant.routes";
import treansactionRouter from "./routes/transactions.routes";

// Импортируем необходимые модули
const express = require("express");
const app = express();
const port = 3000;

const service_company = require("../mocks/service_company.json");

// Middleware для обработки JSON-запросов
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");

    // Обработка GET-запроса на корневой путь
    app.get("/", (req: Request, res: Response) => {
      // @ts-ignore
      res.send("Привет, это простой сервер на Express!");
    });

    // // COUNTERS
    app.use("/counter", counterRouter);

    // INDICATORS
    app.use("/indications", indicationsRouter);

    // PROPERTY
    app.use("/property", propertyRouter);

    // RENT
    app.use("/rent", rentRouter);

    app.get("/service_company", (req: Request, res: Response) => {
      // @ts-ignore
      res.send(service_company);
    });
    app.get("/service_company/:id", (req: Request, res: Response) => {
      // @ts-ignore
      const id = req.params.id;
      try {
        if (service_company[Number(id) - 1]) {
          // @ts-ignore
          res.send(service_company[Number(id) - 1]);
        } else {
          // @ts-ignore
          res.json({ status: `Данного ID: ${id} нет в БД` });
        }
      } catch {
        // @ts-ignore
        res.json({ status: `Данного ID: ${id} нет в БД` });
      }
    });
    app.post("/service_company/create", (req: Request, res: Response) => {
      try {
        // @ts-ignore
        res.status(201).json({ status: "success", data: req.body });
      } catch (e) {}
    });
    app.patch("/service_company/:id", (req: Request, res: Response) => {
      try {
        // @ts-ignore
        res.status(203).json({ status: "success edited", data: req.body });
      } catch (e) {}
    });

    // TENANT
    app.use("/tenant", tenantRouter);

    // TRANSACTIONS
    app.use("/transactions", treansactionRouter);

    // Запуск сервера
    app.listen(port, () => {
      console.log(`Сервер запущен на http://localhost:${port}`);
    });
  })
  .catch((error) => console.log("Database connection error:", error));
