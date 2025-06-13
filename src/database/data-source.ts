import "reflect-metadata";
import { DataSource } from "typeorm";
import { Property } from "../entity/property";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite", // Файл БД
  synchronize: true, // Автоматическое создание таблиц
  logging: true,
  entities: [Property], // Все сущности
  migrations: [],
  subscribers: [],
});
