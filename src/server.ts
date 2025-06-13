import { AppDataSource } from "./database/data-source";

// Импортируем необходимые модули
const express = require("express");
const { getSumFromTransaction } = require("./utils/untils");
const app = express();
const port = 3000;

const counter = require("../mocks/counter.json");
const indications = require("../mocks/indications.json");
const property = require("../mocks/property.json");
const rent = require("../mocks/rent.json");
const service_company = require("../mocks/service_company.json");
const tenant = require("../mocks/tenant.json");
const transactions = require("../mocks/transactions.json");

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

    // COUNTERS
    app.get("/counter", (req: Request, res: Response) => {
      // @ts-ignore
      res.send(counter);
    });
    app.get("/counter/:id", (req: Request, res: Response) => {
      // @ts-ignore
      const id = req.params.id;
      try {
        if (counter[Number(id) - 1]) {
          // @ts-ignore
          res.send(counter[Number(id) - 1]);
        } else {
          // @ts-ignore
          res.json({ status: `Данного ID: ${id} нет в БД` });
        }
      } catch {
        // @ts-ignore
        res.json({ status: `Данного ID: ${id} нет в БД` });
      }
    });
    app.post("/counter", (req: Request, res: Response) => {
      // @ts-ignore
      const propertyId = req.body.propertyId;
      // @ts-ignore
      const respData = counter.filter((item) => item.propertyId == propertyId);

      if (!!respData.length) {
        // @ts-ignore
        return res.status(200).json({ status: "success", data: respData });
      }
      // @ts-ignore
      return res.status(200).json({
        status: "success",
        data: [],
        message: "No counters by propertyId found",
      });
    });

    // INDICATORS
    app.get("/indications", (req: Request, res: Response) => {
      // @ts-ignore
      res.send(indications);
    });
    app.get("/indications/:id", (req: Request, res: Response) => {
      // @ts-ignore
      const id = req.params.id;
      try {
        if (indications[Number(id) - 1]) {
          // @ts-ignore
          res.send(indications[Number(id) - 1]);
        } else {
          // @ts-ignore
          res.json({ status: `Данного ID: ${id} нет в БД` });
        }
      } catch {
        // @ts-ignore
        res.json({ status: `Данного ID: ${id} нет в БД` });
      }
    });
    app.post("/indications", (req: Request, res: Response) => {
      try {
        // @ts-ignore
        const counterId = req.body?.counterId;
        const indicationsFilteredByCounterId = indications?.filter(
          (indication: any) => indication.counterId == counterId
        );

        if (indicationsFilteredByCounterId?.length) {
          const orderedFilteredIndications =
            indicationsFilteredByCounterId.sort(
              // @ts-ignore
              (a, b) => new Date(b.createAt) - new Date(a.createAt)
            );

          const twoLatestIndications = [
            orderedFilteredIndications?.[0],
            orderedFilteredIndications?.[1],
          ];

          const filteredTwoLatestIndications = twoLatestIndications.filter(
            (item) => !!item
          );
          // @ts-ignore
          return res.status(200).json({
            status: "success",
            data: filteredTwoLatestIndications,
          });
        }
        // @ts-ignore
        return res.status(200).json({
          status: "error",
          message: "No any indications for this counterId",
        });
      } catch (e) {
        // @ts-ignore
        res.status(500).json({
          status: "error",
          message: e,
        });
      }
    });

    app.get("/property", (req: Request, res: Response) => {
      try {
        // @ts-ignore
        return res.status(200).json({ status: "success", data: property });
      } catch {
        // @ts-ignore
        res
          // @ts-ignore
          .status(500)
          .json({
            status: "error",
            message: `No properties found in database`,
          });
      }
    });

    app.get("/property/:id", (req: Request, res: Response) => {
      // @ts-ignore
      const id = req.params.id;
      try {
        if (property[Number(id) - 1]) {
          return (
            res
              // @ts-ignore
              .status(200)
              .json({ status: "success", data: [property[Number(id) - 1]] })
          );
        } else {
          res
            // @ts-ignore
            .status(500)
            .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
        }
      } catch {
        res
          // @ts-ignore
          .status(500)
          .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
      }
    });

    app.get("/rent", (req: Request, res: Response) => {
      try {
        // @ts-ignore
        return res.status(200).json({ status: "success", data: rent });
      } catch {
        res
          // @ts-ignore
          .status(500)
          .json({ status: "error", message: `No Rents found in database` });
      }
    });
    app.get("/rent/:id", (req: Request, res: Response) => {
      // @ts-ignore
      const id = req.params.id;
      try {
        if (rent[Number(id) - 1]) {
          res
            // @ts-ignore
            .status(200)
            .json({ status: "success", data: [rent[Number(id) - 1]] });
        } else {
          res
            // @ts-ignore
            .status(500)
            .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
        }
      } catch {
        res
          // @ts-ignore
          .status(500)
          .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
      }
    });
    app.post("/rent", (req: Request, res: Response) => {
      try {
        const search = rent.find(
          // @ts-ignore
          (item) =>
            // @ts-ignore
            item.propertyId === req.body.propertyId &&
            !!item.isActiveRent &&
            new Date() < new Date(item.endContractDate)
        );
        if (!!search) {
          // @ts-ignore
          return res.status(200).json({ status: "success", data: [search] });
        }
        res
          // @ts-ignore
          .status(500)
          .json({
            status: "error",
            message: "No active rent for this property",
          });
      } catch (e) {
        res
          // @ts-ignore
          .status(500)
          .json({
            status: "error",
            message: "No active rent for this property",
          });
      }
    });

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

    app.get("/tenant", (req: Request, res: Response) => {
      // @ts-ignore
      res.send(tenant);
    });
    app.get("/tenant/:id", (req: Request, res: Response) => {
      // @ts-ignore
      const id = req.params.id;
      try {
        if (tenant[Number(id) - 1]) {
          res
            // @ts-ignore
            .status(200)
            .json({ status: "success", data: [tenant[Number(id) - 1]] });
        } else {
          res
            // @ts-ignore
            .status(500)
            .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
        }
      } catch {
        res
          // @ts-ignore
          .status(500)
          .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
      }
    });
    app.post("/tenant", (req: Request, res: Response) => {
      try {
        // @ts-ignore
        const rentId = req?.body?.rentId;
        // @ts-ignore
        const respData = tenant.filter((item) => item.rentId == rentId);
        if (!!respData.length) {
          // @ts-ignore
          return res.status(200).json({ status: "success", data: respData });
        }
        res
          // @ts-ignore
          .status(500)
          .json({
            status: "error",
            message: "No active rent for this property",
          });
      } catch (e) {
        res
          // @ts-ignore
          .status(500)
          .json({
            status: "error",
            message: "No active rent for this property",
          });
      }
    });

    // Обработка POST-запроса
    app.post("/data", (req: Request, res: Response) => {
      console.log("Получены данные:", req.body);
      // @ts-ignore
      res.json({ status: "Данные получены", data: req.body });
    });

    app.post("/transactions", (req: Request, res: Response) => {
      // @ts-ignore
      const rentId = req.body.rentId;

      try {
        const filteredByRentId = transactions?.filter(
          // @ts-ignore
          (transaction) => transaction.rentId == rentId
        );

        const main = filteredByRentId.filter(
          // @ts-ignore
          (invoice: any) => invoice.kindOfPayment == "main"
        );
        // @ts-ignore
        const mainInvoices = main.filter(
          // @ts-ignore
          (invoice) => invoice.type == "invoice"
        );
        const mainPayments = main.filter(
          // @ts-ignore
          (invoice) => invoice.type == "payment"
        );

        const service = filteredByRentId.filter(
          // @ts-ignore
          (invoice) => invoice.kindOfPayment == "service"
        );
        const serviceInvoices = service.filter(
          // @ts-ignore
          (invoice) => invoice.type == "invoice"
        );
        const servicePayments = service.filter(
          // @ts-ignore
          (invoice) => invoice.type == "payment"
        );

        const mainInvoiceSum = getSumFromTransaction(mainInvoices);
        const mainPaymentsSum = getSumFromTransaction(mainPayments);

        const serviceInvoicesSum = getSumFromTransaction(serviceInvoices);
        const servicePaymentsSum = getSumFromTransaction(servicePayments);

        const mainTotal = mainInvoiceSum - mainPaymentsSum;
        const serviceTotal = serviceInvoicesSum - servicePaymentsSum;
        const total = mainTotal + serviceTotal;

        return (
          res
            // @ts-ignore
            .status(200)
            .json({
              status: "success",
              data: [{ mainTotal, serviceTotal, total }],
            })
        );
      } catch (e) {
        // @ts-ignore
        res.status(500).json({
          status: "error",
          message: `Transactions Service internal Error ${e}`,
        });
      }
    });
    // Запуск сервера
    app.listen(port, () => {
      console.log(`Сервер запущен на http://localhost:${port}`);
    });
  })
  .catch((error) => console.log("Database connection error:", error));
