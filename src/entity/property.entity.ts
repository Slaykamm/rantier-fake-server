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

  @Column({ type: "text", nullable: true })
  label: string | undefined;

  @Column({ type: "text", nullable: true })
  image: string | undefined;

  @Column("int")
  rooms!: number;

  @Column("float")
  area!: number;

  @Column("boolean")
  isRented!: boolean;

  @OneToMany(() => Counter, (counter) => counter.propertyId)
  counters!: Counter[];

  @OneToMany(() => Rent, (rent) => rent.property)
  rent!: Rent[];
}
