import { Table } from "@/shared/domain/entity/table";
import { TableColumn } from "@/shared/domain/entity/table_column";
import { DatabaseService } from "@/shared/domain/service/database.service";
import { query } from "@/shared/presentation/lib/db";

export class DatabaseServiceImpl extends DatabaseService {
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

      return result.rows.map(
        (row: { table_name: string; table_type: string }) => ({
          name: row.table_name,
          type: row.table_type,
        }),
      );
    } catch (error) {
      console.error("Error fetching tables:", error);
      return [];
    }
  }

  getTableColumns(tableName: string): Promise<TableColumn[]> {
    throw new Error("Method not implemented.");
  }

  getTableData(tableName: string): Promise<unknown[]> {
    throw new Error("Method not implemented.");
  }
}
