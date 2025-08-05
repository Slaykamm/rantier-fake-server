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

  @Column({ type: "text", nullable: true })
  secondName: string | undefined;

  @Column("text")
  lastName!: string;

  @Column("int")
  tenantType!: number;

  @Column("text")
  phone!: string;

  @Column({ type: "text", nullable: true })
  email: string | undefined;

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

  @ManyToOne(() => Rent, (rent) => rent.tenants, { onDelete: "CASCADE" })
  @JoinColumn({ name: "rentId" }) // это необязательно, если имя колонки совпадает
  rent!: Rent;
}
