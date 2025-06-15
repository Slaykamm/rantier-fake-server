import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Property } from "./property.entity";
import { Transactions } from "./transactions.entity";
import { Indications } from "./indications.entity";

@Entity()
export class Counter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  counterType!: string;

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
  @JoinColumn({ name: "propertyId" }) // это необязательно, если имя колонки совпадает
  property!: Property;

  @OneToMany(() => Indications, (indication) => indication.id)
  tenants!: Counter[];
}
