import "reflect-metadata";
import { DataSource } from "typeorm";
import { Property } from "../entity/property.entity";
import { Counter } from "../entity/counter.entity";
import { Indications } from "../entity/indications.entity";
import { Rent } from "../entity/rent.entity";
import { Tenant } from "../entity/tenant.entity";
import { Transactions } from "../entity/transactions.entity";
import { CounterType } from "../entity/counterType.entity";
import { User } from "../entity/user.entity";
import { Settings } from "../entity/settings.entity";
import { UserDevices } from "../entity/userDevices.entity";
import { Notifications } from "../entity/notifications.entity";
import { DBLogger } from "../logger/dbLogger";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "rantier.sqlite", // Файл БД
  synchronize: true,
  // logging: true,
  entities: [
    Property,
    Counter,
    Indications,
    Rent,
    Tenant,
    Transactions,
    CounterType,
    User,
    UserDevices,
    Settings,
    Notifications,
  ],
  migrations: [],
  subscribers: [],
});
