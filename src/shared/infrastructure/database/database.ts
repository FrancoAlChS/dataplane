import { Environment } from "@/shared/infrastructure/enviroment/enviroment";
import { Pool } from "pg";

export const pool = new Pool({
  host: Environment.DB_HOST,
  port: Number(Environment.DB_PORT),
  user: Environment.DB_USER,
  password: Environment.DB_PASSWORD,
  database: Environment.DB_NAME,
  ssl: Environment.DB_SSL === "true",
});
