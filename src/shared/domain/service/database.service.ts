import { Table } from "../entity/table";
import { TableColumn } from "../entity/table_column";

export abstract class DatabaseService {
  constructor() {}

  abstract getTables(): Promise<Table[]>;
  abstract getTableColumns(tableName: string): Promise<TableColumn[]>;
  abstract getTableData(tableName: string): Promise<unknown[]>;
}
