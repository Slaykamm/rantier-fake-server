// Импортируем необходимые модули
const express = require("express");
const app = express();
const port = 3000;

const counter = require("./mocks/counter.json");
const indications = require("./mocks/indications.json");
const property = require("./mocks/property.json");
const rent = require("./mocks/rent.json");
const service_company = require("./mocks/service_company.json");
const tenant = require("./mocks/tenant.json");
const utility_bills = require("./mocks/utility_bills.json");

// Middleware для обработки JSON-запросов
app.use(express.json());

// Обработка GET-запроса на корневой путь
app.get("/", (req, res) => {
  res.send("Привет, это простой сервер на Express!");
});

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

app.get("/property", (req, res) => {
  res.send(property);
});
app.get("/property/:id", (req, res) => {
  const id = req.params.id;
  try {
    if (property[Number(id) - 1]) {
      res.send(property[Number(id) - 1]);
    } else {
      res.json({ status: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res.json({ status: `Данного ID: ${id} нет в БД` });
  }
});

app.get("/rent", (req, res) => {
  res.send(rent);
});
app.get("/rent/:id", (req, res) => {
  const id = req.params.id;
  try {
    if (rent[Number(id) - 1]) {
      res.send(rent[Number(id) - 1]);
    } else {
      res.json({ status: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res.json({ status: `Данного ID: ${id} нет в БД` });
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

app.get("/tenant", (req, res) => {
  res.send(tenant);
});
app.get("/tenant/:id", (req, res) => {
  const id = req.params.id;
  try {
    if (tenant[Number(id) - 1]) {
      res.send(tenant[Number(id) - 1]);
    } else {
      res.json({ status: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res.json({ status: `Данного ID: ${id} нет в БД` });
  }
});

app.get("/utility_bills", (req, res) => {
  res.send(utility_bills);
});
app.get("/utility_bills/:id", (req, res) => {
  const id = req.params.id;
  try {
    if (utility_bills[Number(id) - 1]) {
      res.send(utility_bills[Number(id) - 1]);
    } else {
      res.json({ status: `Данного ID: ${id} нет в БД` });
    }
  } catch {
    res.json({ status: `Данного ID: ${id} нет в БД` });
  }
});

// Обработка POST-запроса
app.post("/data", (req, res) => {
  console.log("Получены данные:", req.body);
  res.json({ status: "Данные получены", data: req.body });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
