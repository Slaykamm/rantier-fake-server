import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Counter } from "./counter.entity";

@Entity()
export class Indications {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("int")
  counterId!: number;

  @Column("int")
  value!: number;

  @Column("text")
  createAt!: string;

  @ManyToOne(() => Counter, (counter) => counter.indications)
  @JoinColumn({ name: "counterId" }) // это необязательно, если имя колонки совпадает
  counters!: Counter;
}
