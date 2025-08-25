import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserDevices {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("text")
  createAt!: string;

  @Column("int")
  userId!: number;

  @Column("text", { nullable: true })
  token?: string;

  @Column("text", { nullable: true })
  platform?: string;

  @Column("text", { nullable: true })
  tokenUpdatedAt?: string;

  @Column("text", { nullable: true })
  appVersion?: string;

  @Column("text", { nullable: true })
  deviceId?: string;

  @ManyToOne(() => User, (user) => user.devices, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;
}
