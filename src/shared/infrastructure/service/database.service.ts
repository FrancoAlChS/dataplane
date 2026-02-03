import { Table } from "@/shared/domain/entity/table";
import { TableColumn } from "@/shared/domain/entity/table_column";
import { DatabaseService } from "@/shared/domain/service/database.service";
import { query } from "@/shared/presentation/lib/db";
import { TableColumnPG, TablePG } from "../types/type";

class DatabaseServiceImpl extends DatabaseService {
  constructor() {
    super();
  }

  async getTables(): Promise<Table[]> {
    try {
      const result = await query(`
            SELECT table_name, table_type
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
          `);

      return result.rows.map((row: TablePG) => ({
        name: row.table_name,
        type: row.table_type,
      }));
    } catch (error) {
      console.error("Error fetching tables:", error);
      return [];
    }
  }

  async getTableColumns(tableName: string): Promise<TableColumn[]> {
    try {
      const result = await query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `,
        [tableName],
      );

      return result.rows.map((data: TableColumnPG) => ({
        defaultValue: data.column_default,
        name: data.column_name,
        nullable: data.is_nullable,
        type: data.data_type,
      }));
    } catch (error) {
      console.error(`Error fetching columns for table ${tableName}:`, error);
      return [];
    }
  }

  async getTableData(
    tableName: string,
    page: number = 1,
    limit: number = 30,
    sortColumn?: string,
    sortOrder?: "asc" | "desc",
  ): Promise<unknown[]> {
    try {
      const offset = (page - 1) * limit;
      let sortClause = "";
      if (sortColumn && sortOrder) {
        const cleanColumn = sortColumn.replace(/[^a-zA-Z0-9_]/g, "");
        if (cleanColumn) {
          sortClause = `ORDER BY "${cleanColumn}" ${sortOrder === "desc" ? "DESC" : "ASC"}`;
        }
      }

      const result = await query(
        `
        SELECT * 
        FROM "${tableName}"
        ${sortClause}
        LIMIT $1 OFFSET $2;
      `,
        [limit, offset],
      );

      return result.rows;
    } catch (error) {
      console.error(`Error fetching data for table ${tableName}:`, error);
      return [];
    }
  }
}

export const databaseService = new DatabaseServiceImpl();
