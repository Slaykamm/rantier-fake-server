import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Transactions } from "./transactions.entity";
import { Property } from "./property.entity";
import { Tenant } from "./tenant.entity";

@Entity()
export class Rent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  createAt!: string;

  @Column("text")
  contract!: string;

  @Column("text")
  contractDate!: string;

  @Column("text")
  endContractDate!: string;

  @Column("text")
  requestIndicatorsDate: string | undefined;

  @Column("text")
  paymentDate!: string;

  @Column("boolean")
  isActiveRent!: boolean;

  @Column("int")
  amount!: number;

  @Column("float")
  propertyId!: number;

  @OneToMany(() => Transactions, (transaction) => transaction.id)
  counters!: Rent[];

  @OneToMany(() => Tenant, (tenant) => tenant.id)
  tenants!: Rent[];

  @ManyToOne(() => Property, (property) => property.id)
  @JoinColumn({ name: "propertyId" }) // это необязательно, если имя колонки совпадает
  rent!: Property;
}
