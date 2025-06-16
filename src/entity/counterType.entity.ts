import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Counter } from "./counter.entity";

@Entity()
export class CounterType {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  type!: string; // "electricity" или "hotWater"

  @Column("text", { nullable: true })
  description?: string;

  @OneToMany(() => Counter, (counter) => counter.counterType) // указывает на поле к которому коннектим там
  counters!: Counter[]; //указываем на обратную сущность.  куда пихаем все найденные связи.
  // потом массив.
}
