import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Counter } from "./counter.entity";
import { Rent } from "./rent.entity";

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  createAt!: string;

  @Column("int")
  rentId!: number;

  @Column("int")
  amount!: number;

  @Column("text")
  kindOfPayment!: string;

  @Column("text")
  type!: string;

  @ManyToOne(() => Rent, (rent) => rent.transactions)
  @JoinColumn({ name: "rentId" }) // это необязательно, если имя колонки совпадает
  rent!: Rent;
}
