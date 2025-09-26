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

  // СЕРВИСЫ

  // сервис  емаил для общения с клиентом
  @Column("boolean", { default: false })
  emailService!: boolean;

  // сервис телеграмм для общения с клиентом
  @Column("boolean", { default: false })
  telegrammService!: boolean;

  //  Включен ли нотификейшн сервис.
  @Column("boolean", { default: false })
  notificationService!: boolean;

  // НАПОМИНАНИЯ Арендодателю

  // высылать ли арендатору напоминания высылать счетчики
  @Column("boolean")
  isCounterReminder!: boolean;

  @Column("int")
  counterReminderDays!: number;

  // высылать ли арендатору напоминания высылать про оплату (+ формировать сумму)
  @Column("boolean")
  isPaymentReminder!: boolean;

  @Column("int")
  paymentReminderDays!: number;

  // Напоминать ли пользователю арендо дателю про: истечения контракта
  @Column("boolean")
  isContractExpired!: boolean;

  @Column("int")
  contractExpiredDays!: number;

  // Напоминать ли пользователю арендо дателю про: истечения контракта / про оплату
  @Column("boolean")
  isRequestPaymentRemind!: boolean;

  @Column("int")
  requestPaymentRemindDays!: number;

  // CRM
  // Выставлять автоматически счет клинту за X дня до оплаты
  @Column("boolean")
  isAutoInvoicing!: boolean;

  @Column("int")
  autoInvoicingDays!: number;

  // СВЯЗИ. ОПАСНЫЕ ЗВЯЗИ

  @ManyToOne(() => User, (user) => user.settings, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;
}
