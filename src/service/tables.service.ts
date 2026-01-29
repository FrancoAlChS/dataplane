import { query } from "@/shared/presentation/lib/db";

export async function getTables() {
  try {
    const result = await query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);

    return result.rows.map((row: { table_name: string }) => row.table_name);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return [];
  }
}

export async function getTableColumns(tableName: string) {
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

    return result.rows;
  } catch (error) {
    console.error(`Error fetching columns for table ${tableName}:`, error);
    return [];
  }
}

export async function getTableData(
  tableName: string,
  page: number = 1,
  limit: number = 30,
) {
  try {
    const offset = (page - 1) * limit;
    // Note: We use a template literal for the table name because pg doesn't support parameterized table names.
    // However, we should be careful with SQL injection. In this app, tableName comes from our own getTables list.
    const result = await query(
      `
        SELECT * 
        FROM "${tableName}"
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
