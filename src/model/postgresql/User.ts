import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Message } from "./Message.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", {
    length: 100,
    unique: true,
    nullable: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name: string;

  @Column("varchar", { length: 200 })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Column()
  @IsEmail()
  email: string;

  @Column({ type: "bool" })
  @IsBoolean()
  subscription: boolean;

  @Column({ type: "bool" })
  @IsBoolean()
  isAdmin: boolean;

  @Column({ type: "int" })
  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @Column({ type: "timestamp" })
  @IsDate()
  createDate: Date;

  @OneToMany(() => Message, (message) => message.user)
  messages: Relation<Message>[];
}
