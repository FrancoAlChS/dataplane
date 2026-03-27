export interface Database {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
  type: "postgres" | "mysql";
}
