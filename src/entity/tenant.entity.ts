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

  @Column({ type: "int", nullable: true })
  tgId: number | undefined;

  @Column({ type: "text", nullable: true })
  tgNick: string | undefined;

  @Column({ type: "text", nullable: true })
  passportSeries: string | undefined;

  @Column({ type: "text", nullable: true })
  passportNumber: string | undefined;

  @Column({ type: "text", nullable: true })
  passportDate: string | undefined;

  @Column({ type: "text", nullable: true })
  passportIssued: string | undefined;

  @Column("int")
  rentId!: number;

  @ManyToOne(() => Rent, (rent) => rent.tenants)
  @JoinColumn({ name: "rentId" }) // это необязательно, если имя колонки совпадает
  rent!: Rent;
}
