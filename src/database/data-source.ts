import "reflect-metadata";
import { DataSource } from "typeorm";
import { Property } from "../entity/property.entity";
import { Counter } from "../entity/counter.entity";
import { Indications } from "../entity/indications.entity";
import { Rent } from "../entity/rent.entity";
import { Tenant } from "../entity/tenant.entity";
import { Transactions } from "../entity/transactions.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "rantier.sqlite", // Файл БД
  synchronize: true, // Автоматическое создание таблиц
  logging: true,
  entities: [Property, Counter, Indications, Rent, Tenant, Transactions], // Все сущности
  migrations: [],
  subscribers: [],
});
