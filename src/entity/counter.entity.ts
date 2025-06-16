import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Property } from "./property.entity";
import { Indications } from "./indications.entity";
import { CounterType } from "./counterType.entity";

@Entity()
export class Counter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  counterTypeId!: number; // Это должен быть ID типа счетчика

  @Column("text")
  counterId!: string;

  @Column("text")
  verificationDate!: string;

  @Column("text")
  nextVerificationDate!: string;

  @Column("int")
  propertyId!: number;

  @Column("boolean")
  isActive!: boolean;

  @ManyToOne(() => Property, (property) => property.counters)
  @JoinColumn({ name: "propertyId" })
  property!: Property;

  @OneToMany(() => Indications, (indication) => indication.counters)
  indications!: Indications[];

  @ManyToOne(() => CounterType, (counterType) => counterType.counters) // ссылка на поле в сущности которую коннектим
  // сюда в добавленном поле OneToMany там. обратная ссулка. кот- содержит Counter
  @JoinColumn({ name: "counterTypeId" }) // наименование поле к коотором коннектим
  counterType!: CounterType; // создаем поле с сущностью которую сюда подключаем. будет же 1 значение.
}
