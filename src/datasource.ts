import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { User } from "./entity/user";
import { Task } from "./entity/task";


dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "5432"),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  entities: [User, Task],
  synchronize: true,
  logging: false,
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});