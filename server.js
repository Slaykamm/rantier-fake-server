// Импортируем необходимые модули
const express = require("express");
const { getSumFromTransaction } = require("./utils/untils");
const app = express();
const port = 3000;

const counter = require("./mocks/counter.json");
const indications = require("./mocks/indications.json");
const property = require("./mocks/property.json");
const rent = require("./mocks/rent.json");
const service_company = require("./mocks/service_company.json");
const tenant = require("./mocks/tenant.json");
const transactions = require("./mocks/transactions.json");

// Middleware для обработки JSON-запросов
app.use(express.json());

// Обработка GET-запроса на корневой путь
app.get("/", (req, res) => {
  res.send("Привет, это простой сервер на Express!");
});

// COUNTERS
app.get("/counter", (req, res) => {
  res.send(counter);
});
app.get("/counter/:id", (req, res) => {
  const id = req.params.id;
  try {
    if (counter[Number(id) - 1]) {
      res.send(counter[Number(id) - 1]);
    } else {
      res.json({ status: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res.json({ status: `Данного ID: ${id} нет в БД` });
  }
});
app.post("/counter", (req, res) => {
  const propertyId = req.body.propertyId;
  const respData = counter.filter((item) => item.propertyId == propertyId);

  if (!!respData.length) {
    return res.status(200).json({ status: "success", data: respData });
  }
  return res.status(200).json({
    status: "success",
    data: [],
    message: "No counters by propertyId found",
  });
});

// INDICATORS
app.get("/indications", (req, res) => {
  res.send(indications);
});
app.get("/indications/:id", (req, res) => {
  const id = req.params.id;
  try {
    if (indications[Number(id) - 1]) {
      res.send(indications[Number(id) - 1]);
    } else {
      res.json({ status: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res.json({ status: `Данного ID: ${id} нет в БД` });
  }
});
app.post("/indications", (req, res) => {
  try {
    const counterId = req.body.counterId;
    const indicationsFilteredByCounterId = indications?.filter(
      (indication) => indication.counterId == counterId
    );

    if (indicationsFilteredByCounterId?.length) {
      const orderedFilteredIndications = indicationsFilteredByCounterId.sort(
        (a, b) => new Date(b.createAt) - new Date(a.createAt)
      );

      const twoLatestIndications = [
        orderedFilteredIndications?.[0],
        orderedFilteredIndications?.[1],
      ];

      const filteredTwoLatestIndications = twoLatestIndications.filter(
        (item) => !!item
      );

      return res.status(200).json({
        status: "success",
        data: filteredTwoLatestIndications,
      });
    }
    return res.status(200).json({
      status: "error",
      message: "No any indications for this counterId",
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: e,
    });
  }
});

app.get("/property", (req, res) => {
  try {
    return res.status(200).json({ status: "success", data: property });
  } catch {
    res
      .status(500)
      .json({ status: "error", message: `No properties found in database` });
  }
});

app.get("/property/:id", (req, res) => {
  const id = req.params.id;
  try {
    if (property[Number(id) - 1]) {
      return res
        .status(200)
        .json({ status: "success", data: [property[Number(id) - 1]] });
    } else {
      res
        .status(500)
        .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res
      .status(500)
      .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
  }
});

app.get("/rent", (req, res) => {
  try {
    return res.status(200).json({ status: "success", data: rent });
  } catch {
    res
      .status(500)
      .json({ status: "error", message: `No Rents found in database` });
  }
});
app.get("/rent/:id", (req, res) => {
  const id = req.params.id;
  try {
    if (rent[Number(id) - 1]) {
      res.status(200).json({ status: "success", data: [rent[Number(id) - 1]] });
    } else {
      res
        .status(500)
        .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res
      .status(500)
      .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
  }
});
app.post("/rent", (req, res) => {
  try {
    const search = rent.find(
      (item) =>
        item.property_id === req.body.property_id &&
        !!item.isActiveRent &&
        new Date() < new Date(item.end_contract_date)
    );
    if (!!search) {
      return res.status(200).json({ status: "success", data: [search] });
    }
    res
      .status(500)
      .json({ status: "error", message: "No active rent for this property" });
  } catch (e) {
    res
      .status(500)
      .json({ status: "error", message: "No active rent for this property" });
  }
});

app.get("/service_company", (req, res) => {
  res.send(service_company);
});
app.get("/service_company/:id", (req, res) => {
  const id = req.params.id;
  try {
    if (service_company[Number(id) - 1]) {
      res.send(service_company[Number(id) - 1]);
    } else {
      res.json({ status: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res.json({ status: `Данного ID: ${id} нет в БД` });
  }
});
app.post("/service_company/create", (req, res) => {
  try {
    res.status(201).json({ status: "success", data: req.body });
  } catch (e) {}
});
app.patch("/service_company/:id", (req, res) => {
  try {
    res.status(203).json({ status: "success edited", data: req.body });
  } catch (e) {}
});

app.get("/tenant", (req, res) => {
  res.send(tenant);
});
app.get("/tenant/:id", (req, res) => {
  const id = req.params.id;
  try {
    if (tenant[Number(id) - 1]) {
      res
        .status(200)
        .json({ status: "success", data: [tenant[Number(id) - 1]] });
    } else {
      res
        .status(500)
        .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res
      .status(500)
      .json({ status: "error", message: `Данного ID: ${id} нет в БД` });
  }
});
// app.post("/tenant", (req, res) => {
//   try {
//     const search = tenant.find(
//       (item) =>
//         item.property_id === req.body.property_id &&
//         !!item.isActiveRent &&
//         new Date() < new Date(item.end_contract_date)
//     );
//     if (!!search) {
//       res.status(200).json({ status: "success", data: search });
//     }
//     res
//       .status(200)
//       .json({ status: "error", message: "No active rent for this property" });
//   } catch (e) {}

//   res.send(tenant);
// });

// Обработка POST-запроса
app.post("/data", (req, res) => {
  console.log("Получены данные:", req.body);
  res.json({ status: "Данные получены", data: req.body });
});

app.post("/transactions", (req, res) => {
  const rentId = req.body.rentId;

  try {
    const filteredByRentId = transactions?.filter(
      (transaction) => transaction.rentId == rentId
    );

    const main = filteredByRentId.filter(
      (invoice) => invoice.kindOfPayment == "main"
    );
    const mainInvoices = main.filter((invoice) => invoice.type == "invoice");
    const mainPayments = main.filter((invoice) => invoice.type == "payment");

    const service = filteredByRentId.filter(
      (invoice) => invoice.kindOfPayment == "service"
    );
    const serviceInvoices = service.filter(
      (invoice) => invoice.type == "invoice"
    );
    const servicePayments = service.filter(
      (invoice) => invoice.type == "payment"
    );

    const mainInvoiceSum = getSumFromTransaction(mainInvoices);
    const mainPaymentsSum = getSumFromTransaction(mainPayments);

    const serviceInvoicesSum = getSumFromTransaction(serviceInvoices);
    const servicePaymentsSum = getSumFromTransaction(servicePayments);

    const mainTotal = mainInvoiceSum - mainPaymentsSum;
    const serviceTotal = serviceInvoicesSum - servicePaymentsSum;
    const total = mainTotal + serviceTotal;

    return res
      .status(200)
      .json({ status: "success", data: [{ mainTotal, serviceTotal, total }] });
  } catch (e) {
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
