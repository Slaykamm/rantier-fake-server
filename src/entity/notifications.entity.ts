import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Counter } from "./counter.entity";
import { User } from "./user.entity";

@Entity()
export class Notifications {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  createAt!: string;

  @Column("int", { nullable: true })
  userId!: number;

  @Column("boolean")
  isExecuted!: boolean;

  @Column("boolean", { nullable: true })
  isError!: boolean;

  @Column("text", { nullable: true })
  token?: string;

  @Column("text", { nullable: true })
  title?: string;

  @Column("text", { nullable: true })
  body?: string;

  @Column("text", { nullable: true })
  key?: string;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;
}
