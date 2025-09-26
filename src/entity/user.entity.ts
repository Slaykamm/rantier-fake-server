import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./property.entity";
import { Settings } from "./settings.entity";
import { UserDevices } from "./userDevices.entity";
import { Notifications } from "./notifications.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("text")
  userId!: string;

  @Column("text")
  email!: string;

  @Column("text", { nullable: true })
  firstName?: string;

  @Column("text", { nullable: true })
  lastName?: string;

  @Column("text", { nullable: true })
  avatar?: string;

  @Column("text", { nullable: true })
  tgId!: string;

  @Column("text", { nullable: true })
  tgNickname?: string;

  @Column("boolean", { nullable: true, default: true })
  initialLogin?: boolean;

  @OneToMany(() => Property, (property) => property.user) // указывает на поле к которому коннектим там
  properties!: Property[]; //указываем на обратную сущность.  куда пихаем все найденные связи.
  // /потом массив.

  @OneToMany(() => UserDevices, (device) => device.user) // указывает на поле к которому коннектим там
  devices!: UserDevices[]; //указываем на обратную сущность.  куда пихаем все найденные связи.
  // /потом массив.

  @OneToMany(() => Settings, (settings) => settings.user) // указывает на поле к которому коннектим там
  settings!: Settings[]; //указываем на обратную сущность.  куда пихаем все найденные связи.
  // /потом массив.

  @OneToMany(() => Notifications, (notification) => notification.user) // указывает на поле к которому коннектим там
  notifications!: Notifications[]; //указываем на обратную сущность.  куда пихаем все найденные связи.
  // /потом массив.
}
