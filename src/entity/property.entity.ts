import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Counter } from "./counter.entity";
import { Rent } from "./rent.entity";

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name!: string;

  @Column("text")
  address!: string;

  @Column("text")
  label: string | undefined;

  @Column("text")
  image: string | undefined;

  @Column("int")
  rooms!: number;

  @Column("float")
  area!: number;

  @Column("boolean")
  isRented!: boolean;

  @OneToMany(() => Counter, (counter) => counter.counterId)
  counters!: Counter[];

  @OneToMany(() => Rent, (rent) => rent.id)
  rents!: Rent[];
}
