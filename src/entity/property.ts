import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  name: string | undefined;

  @Column("text")
  address: string | undefined;
}
