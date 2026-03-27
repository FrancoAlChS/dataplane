import { Column } from "../entity/column";
import { Table } from "../entity/table";

export abstract class TableService {
  abstract getTables(): Promise<Table[]>;

  abstract getColumns(tableName: string): Promise<Column[]>;

  abstract createTable(
    tableName: string,
    columns: {
      name: string;
      type: string;
      nullable: boolean;
      defaultValue?: string;
      primaryKey: boolean;
    }[],
  ): Promise<void>;

  abstract getData(
    tableName: string,
    page?: number,
    limit?: number,
    sortColumn?: string,
    sortOrder?: "asc" | "desc",
    filter?: string,
  ): Promise<unknown[]>;

  abstract getTotalCount(tableName: string, filter?: string): Promise<number>;

  abstract createRecord(
    tableName: string,
    data: Record<string, unknown>,
  ): Promise<void>;

  abstract getRecordByValue(
    tableName: string,
    columnName: string,
    value: unknown,
  ): Promise<unknown>;

  abstract updateRecord(
    tableName: string,
    conditions: Record<string, unknown>,
    data: Record<string, unknown>,
  ): Promise<void>;

  abstract deleteRecords(
    tableName: string,
    conditions: Record<string, unknown>[],
  ): Promise<void>;

  abstract dropTable(tableName: string): Promise<void>;

  abstract alterTable(
    tableName: string,
    columns: {
      name: string;
      originalName?: string;
      type: string;
      nullable: boolean;
      defaultValue?: string;
      primaryKey: boolean;
    }[],
  ): Promise<void>;
  abstract getDatabaseStats(): Promise<{
    tableCount: number;
    rowCount: number;
  }>;
}
