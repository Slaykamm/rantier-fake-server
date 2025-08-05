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

  @Column({ type: "text", nullable: true })
  requestIndicatorsDate: string | undefined;

  @Column("text")
  paymentDate!: string;

  @Column("boolean")
  isActiveRent!: boolean;

  @Column("int")
  amount!: number;

  @Column("float")
  propertyId!: number;

  @OneToMany(() => Transactions, (transaction) => transaction.rent)
  transactions!: Transactions[];

  @OneToMany(() => Tenant, (tenant) => tenant.rentId)
  tenants!: Tenant[];

  @ManyToOne(() => Property, (property) => property.rent, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "propertyId" }) // это необязательно, если имя колонки совпадает
  property!: Property;
}
