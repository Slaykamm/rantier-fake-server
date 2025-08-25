import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  userId!: number;

  // сервис  емаил для общения с клиентом
  @Column("boolean")
  email!: boolean;

  // сервис телеграмм для общения с клиентом
  @Column("boolean")
  telegramm!: boolean;

  // высылать ли арендатору напоминания высылать счетчики
  @Column("boolean")
  counter_reminder!: boolean;

  // высылать ли арендатору напоминания высылать про оплату (+ формировать сумму)
  @Column("boolean")
  payment_reminder!: boolean;

  // Напоминать ли пользователю арендо дателю про: истечения контракта / про оплату / внести оплату
  @Column("boolean")
  notification_service!: boolean;

  // Выставлять автоматически счет клинту за 3 дня до оплаты
  @Column("boolean")
  auto_invoicing!: boolean;

  @ManyToOne(() => User, (user) => user.settings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;
}
