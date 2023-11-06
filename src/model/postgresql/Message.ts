import { IsDate, IsString } from "class-validator";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { User } from "./User.js";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  text: string;

  @Column({ type: "timestamp" })
  @IsDate()
  createDate: Date;

  @ManyToOne(() => User, (user) => user.messages)
  user: Relation<User>; // use Relation in ESM projects
}
