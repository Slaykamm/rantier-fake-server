import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Rent } from "./rent.entity";

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  firstName!: string;

  @Column("text")
  secondName!: string;

  @Column("text")
  lastName!: string;

  @Column("int")
  tenantType!: number;

  @Column("text")
  phone!: string;

  @Column("text")
  email!: string;

  @Column("int")
  tgId: number | undefined;

  @Column("text")
  tgNick: string | undefined;

  @Column("text")
  passportSeries: string | undefined;

  @Column("text")
  passportNumber: string | undefined;

  @Column("text")
  passportDate: string | undefined;

  @Column("text")
  passportIssued: string | undefined;

  @Column("int")
  rentId!: number;

  @ManyToOne(() => Rent, (rent) => rent.id)
  @JoinColumn({ name: "rentId" }) // это необязательно, если имя колонки совпадает
  rent!: Rent;
}
