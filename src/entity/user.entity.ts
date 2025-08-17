import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Counter } from "./counter.entity";
import { Property } from "./property.entity";
import { Settings } from "./settings.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("text")
  userId!: string;

  @Column("text")
  email!: string;

  @Column("text", { nullable: true })
  firstName?: string;

  @Column("text", { nullable: true })
  lastName?: string;

  @Column("text", { nullable: true })
  avatar?: string;

  @Column("text", { nullable: true })
  tgId!: string;

  @Column("text", { nullable: true })
  tgNickname?: string;

  @OneToMany(() => Property, (property) => property.userId) // указывает на поле к которому коннектим там
  property!: Property[]; //указываем на обратную сущность.  куда пихаем все найденные связи.
  // /потом массив.

  @OneToMany(() => Settings, (settings) => settings.userId) // указывает на поле к которому коннектим там
  settings!: Settings[]; //указываем на обратную сущность.  куда пихаем все найденные связи.
  // /потом массив.
}
