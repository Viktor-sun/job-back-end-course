import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./model/postgresql/User.js";
import { Message } from "./model/postgresql/Message.js";
import { SeederOptions } from "typeorm-extension";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url)); // alternative to __dirname in Node.js with ES modules

const isDocker = process.env.NODE_ENV === "docker";

const options: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: isDocker ? "postgresdb" : "localhost",
  port: 5432,
  username: "postgres",
  password: "example",
  database: "mydb",
  synchronize: false,
  logging: true,
  entities: [User, Message],
  migrations: [__dirname + "/migrations/*{.ts,.js}"],
  seeds: [__dirname + "/seeds/*{.ts,.js}"],
  factories: [__dirname + "/factories/*{.ts,.js}"],
};

export const AppDataSource = new DataSource(options);
