import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./User.js";
import { Message } from "./Message.js";

const isDocker = process.env.NODE_ENV === "docker";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: isDocker ? "postgresdb" : "localhost",
  port: 5432,
  username: "postgres",
  password: "example",
  database: "mydb",
  synchronize: false,
  logging: true,
  migrations: ["src/migrations/*.ts"],
  entities: [User, Message],
  subscribers: [],
});
