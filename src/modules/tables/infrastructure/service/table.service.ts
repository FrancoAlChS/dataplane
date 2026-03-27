import { query } from "@/shared/presentation/lib/db";
import { Column } from "../../domain/entity/column";
import { Table } from "../../domain/entity/table";
import { TableService } from "../../domain/service/table.service";
import { ColumnPG } from "../types/column-pg";
import { TablePG } from "../types/table-pg";

export class TableServiceImpl extends TableService {
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

  async createTable(
    tableName: string,
    columns: {
      name: string;
      type: string;
      nullable: boolean;
      defaultValue?: string;
      primaryKey: boolean;
      isForeignKey?: boolean;
      referenceTable?: string;
      referenceColumn?: string;
    }[],
  ): Promise<void> {
    try {
      const cleanTable = tableName.replace(/[^a-zA-Z0-9_]/g, "");

      const columnDefs = columns.map((col) => {
        const cleanColName = col.name.replace(/[^a-zA-Z0-9_]/g, "");
        let pgType = col.type;
        if (pgType.toLowerCase() === "array") {
          pgType = "text[]";
        }
        let def = `"${cleanColName}" ${pgType}`;

        if (!col.nullable) {
          def += " NOT NULL";
        }

        if (col.defaultValue) {
          def += ` DEFAULT ${col.defaultValue}`;
        }

        if (col.isForeignKey && col.referenceTable && col.referenceColumn) {
          const cleanRefTable = col.referenceTable.replace(/[^a-zA-Z0-9_]/g, "");
          const cleanRefCol = col.referenceColumn.replace(/[^a-zA-Z0-9_]/g, "");
          def += ` REFERENCES "${cleanRefTable}"("${cleanRefCol}")`;
        }

        return def;
      });

      const primaryKeys = columns
        .filter((col) => col.primaryKey)
        .map((col) => `"${col.name.replace(/[^a-zA-Z0-9_]/g, "")}"`);

      let queryText = `CREATE TABLE "${cleanTable}" (\n  ${columnDefs.join(",\n  ")}`;

      if (primaryKeys.length > 0) {
        queryText += `,\n  PRIMARY KEY (${primaryKeys.join(", ")})`;
      }

      queryText += "\n);";

      await query(queryText);
    } catch (error) {
      console.error(`Error creating table ${tableName}:`, error);
      throw error;
    }
  }

  async getColumns(tableName: string): Promise<Column[]> {
    try {
      const result = await query(
        `
          SELECT 
              c.column_name, 
              c.data_type, 
              c.is_nullable, 
              c.column_default,
              c.is_identity,
              EXISTS (
                  SELECT 1 
                  FROM information_schema.table_constraints tc 
                  JOIN information_schema.key_column_usage kcu 
                    ON tc.constraint_name = kcu.constraint_name 
                    AND tc.table_schema = kcu.table_schema
                  WHERE tc.constraint_type = 'PRIMARY KEY' 
                    AND tc.table_name = c.table_name 
                    AND kcu.column_name = c.column_name
              ) as is_primary_key,
              ccu.table_name AS foreign_table,
              ccu.column_name AS foreign_column,
              fk_kcu.constraint_name AS foreign_constraint
          FROM information_schema.columns c
          LEFT JOIN (
              SELECT kcu.table_name, kcu.column_name, kcu.table_schema, kcu.constraint_name
              FROM information_schema.key_column_usage kcu
              JOIN information_schema.table_constraints tc 
                ON kcu.constraint_name = tc.constraint_name 
                AND kcu.table_schema = tc.table_schema 
                AND tc.constraint_type = 'FOREIGN KEY'
          ) fk_kcu ON c.table_name = fk_kcu.table_name 
             AND c.column_name = fk_kcu.column_name 
             AND c.table_schema = fk_kcu.table_schema
          LEFT JOIN information_schema.constraint_column_usage ccu 
            ON fk_kcu.constraint_name = ccu.constraint_name 
            AND fk_kcu.table_schema = ccu.table_schema
          WHERE c.table_schema = 'public' AND c.table_name = $1
          ORDER BY c.ordinal_position;
        `,
        [tableName],
      );

      return result.rows.map((data: ColumnPG) => ({
        defaultValue: data.column_default,
        name: data.column_name,
        nullable: data.is_nullable === "YES",
        type: data.data_type,
        primaryKey: data.is_primary_key,
        isAutoincrement:
          data.is_identity === "YES" ||
          (data.column_default?.includes("nextval") ?? false),
        foreignKey: data.foreign_table
          ? {
              table: data.foreign_table,
              column: data.foreign_column!,
              constraint: data.foreign_constraint,
            }
          : undefined,
      }));
    } catch (error) {
      console.error(`Error fetching columns for table ${tableName}:`, error);
      return [];
    }
  }

  async getData(
    tableName: string,
    page: number = 1,
    limit: number = 30,
    sortColumn?: string,
    sortOrder?: "asc" | "desc",
    filter?: string,
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

      let whereClause = "";
      if (filter && filter.trim().length > 0) {
        whereClause = `WHERE ${filter}`;
      }

      const result = await query(
        `
          SELECT * 
          FROM "${tableName}"
          ${whereClause}
          ${sortClause}
          LIMIT $1 OFFSET $2;
        `,
        [limit, offset],
      );

      return result.rows;
    } catch (error) {
      console.error(`Error fetching data for table ${tableName}:`, error);
      throw error; // Rethrow to handle it in the UI (Server Action)
    }
  }

  async getTotalCount(tableName: string, filter?: string): Promise<number> {
    try {
      let whereClause = "";
      if (filter && filter.trim().length > 0) {
        whereClause = `WHERE ${filter}`;
      }

      const result = await query(
        `
          SELECT COUNT(*) as total 
          FROM "${tableName}"
          ${whereClause};
        `,
      );

      return parseInt(result.rows[0].total, 10);
    } catch (error) {
      console.error(
        `Error fetching total count for table ${tableName}:`,
        error,
      );
      return 0;
    }
  }

  async getRecordByValue(
    tableName: string,
    columnName: string,
    value: unknown,
  ): Promise<unknown> {
    try {
      const cleanTable = tableName.replace(/[^a-zA-Z0-9_]/g, "");
      const cleanColumn = columnName.replace(/[^a-zA-Z0-9_]/g, "");

      const result = await query(
        `
          SELECT * 
          FROM "${cleanTable}"
          WHERE "${cleanColumn}" = $1;
        `,
        [value],
      );

      return result.rows[0];
    } catch (error) {
      console.error(
        `Error fetching record from table ${tableName} where ${columnName} = ${value}:`,
        error,
      );
      return null;
    }
  }

  async createRecord(
    tableName: string,
    data: Record<string, unknown>,
  ): Promise<void> {
    try {
      const cleanTable = tableName.replace(/[^a-zA-Z0-9_]/g, "");
      const keys = Object.keys(data);
      const columns = keys
        .map((k) => `"${k.replace(/[^a-zA-Z0-9_]/g, "")}"`)
        .join(", ");
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
      const values = keys.map((k) => {
        const val = data[k];
        // Don't stringify arrays if they are intended to be native arrays
        // Node-postgres handles arrays automatically
        if (Array.isArray(val)) {
          return val;
        }
        if (val !== null && typeof val === "object") {
          return JSON.stringify(val);
        }
        return val;
      });

      const queryText = `INSERT INTO "${cleanTable}" (${columns}) VALUES (${placeholders})`;
      await query(queryText, values);
    } catch (error) {
      console.error(`Error creating record in ${tableName}:`, error);
      throw error;
    }
  }

  async updateRecord(
    tableName: string,
    conditions: Record<string, unknown>,
    data: Record<string, unknown>,
  ): Promise<void> {
    try {
      const cleanTable = tableName.replace(/[^a-zA-Z0-9_]/g, "");
      const updateKeys = Object.keys(data);
      if (updateKeys.length === 0) return;

      const setClause = updateKeys
        .map((k, i) => `"${k.replace(/[^a-zA-Z0-9_]/g, "")}" = $${i + 1}`)
        .join(", ");

      const conditionKeys = Object.keys(conditions);
      const whereClause = conditionKeys
        .map(
          (k, i) =>
            `"${k.replace(/[^a-zA-Z0-9_]/g, "")}" = $${updateKeys.length + i + 1}`,
        )
        .join(" AND ");

      const values = [
        ...updateKeys.map((k) => {
          const val = data[k];
          if (Array.isArray(val)) {
            return val;
          }
          if (val !== null && typeof val === "object") {
            return JSON.stringify(val);
          }
          return val;
        }),
        ...conditionKeys.map((k) => conditions[k]),
      ];

      const queryText = `UPDATE "${cleanTable}" SET ${setClause} WHERE ${whereClause}`;
      await query(queryText, values);
    } catch (error) {
      console.error(`Error updating record in ${tableName}:`, error);
      throw error;
    }
  }

  async deleteRecords(
    tableName: string,
    conditions: Record<string, unknown>[],
  ): Promise<void> {
    if (conditions.length === 0) return;

    try {
      const cleanTable = tableName.replace(/[^a-zA-Z0-9_]/g, "");
      const keys = Object.keys(conditions[0]);
      const columns = keys
        .map((k) => `"${k.replace(/[^a-zA-Z0-9_]/g, "")}"`)
        .join(", ");

      const values: unknown[] = [];
      let whereClause = "";

      if (keys.length === 1) {
        // Simple case: single primary key
        const key = keys[0];
        const placeholders = conditions
          .map((_, i) => {
            values.push(conditions[i][key]);
            return `$${i + 1}`;
          })
          .join(", ");
        whereClause = `"${key.replace(/[^a-zA-Z0-9_]/g, "")}" IN (${placeholders})`;
      } else {
        // Row constructor case: multiple primary keys
        const rowPlaceholders = conditions
          .map((condition) => {
            const innerPlaceholders = keys
              .map((key) => {
                values.push(condition[key]);
                return `$${values.length}`;
              })
              .join(", ");
            return `(${innerPlaceholders})`;
          })
          .join(", ");
        whereClause = `(${columns}) IN (${rowPlaceholders})`;
      }

      const queryText = `DELETE FROM "${cleanTable}" WHERE ${whereClause}`;
      await query(queryText, values);
    } catch (error) {
      console.error(`Error deleting records from ${tableName}:`, error);
      throw error;
    }
  }

  async dropTable(tableName: string): Promise<void> {
    try {
      const cleanTable = tableName.replace(/[^a-zA-Z0-9_]/g, "");
      await query(`DROP TABLE "${cleanTable}";`);
    } catch (error) {
      console.error(`Error dropping table ${tableName}:`, error);
      throw error;
    }
  }

  async alterTable(
    tableName: string,
    columns: {
      name: string;
      originalName?: string;
      type: string;
      nullable: boolean;
      defaultValue?: string;
      primaryKey: boolean;
      isForeignKey?: boolean;
      referenceTable?: string;
      referenceColumn?: string;
    }[],
  ): Promise<void> {
    try {
      const cleanTable = tableName.replace(/[^a-zA-Z0-9_]/g, "");
      const currentColumns = await this.getColumns(tableName);
      const alterQueries: string[] = [];

      // 1. Handle Added and Modified Columns
      for (const col of columns) {
        const cleanName = col.name.replace(/[^a-zA-Z0-9_]/g, "");
        let pgType = col.type;
        if (pgType.toLowerCase() === "array") pgType = "text[]";

        if (!col.originalName) {
          // New column: ADD
          let addDef = `ADD COLUMN "${cleanName}" ${pgType}`;
          if (!col.nullable) addDef += " NOT NULL";
          if (col.defaultValue) addDef += ` DEFAULT ${col.defaultValue}`;
          
          if (col.isForeignKey && col.referenceTable && col.referenceColumn) {
            const cleanRefTable = col.referenceTable.replace(/[^a-zA-Z0-9_]/g, "");
            const cleanRefCol = col.referenceColumn.replace(/[^a-zA-Z0-9_]/g, "");
            addDef += ` REFERENCES "${cleanRefTable}"("${cleanRefCol}")`;
          }
          
          alterQueries.push(addDef);
        } else {
          // Existing column: Compare and Modify
          const cleanOriginalName = col.originalName.replace(/[^a-zA-Z0-9_]/g, "");
          const current = currentColumns.find((c) => c.name === col.originalName);

          if (current) {
            // Rename if name changed
            if (cleanName !== cleanOriginalName) {
              await query(
                `ALTER TABLE "${cleanTable}" RENAME COLUMN "${cleanOriginalName}" TO "${cleanName}";`,
              );
            }

            // Change Type if changed
            // Note: Postgres often needs "USING column::type" for casting
            if (pgType.toLowerCase() !== current.type.toLowerCase()) {
              alterQueries.push(
                `ALTER COLUMN "${cleanName}" TYPE ${pgType} USING "${cleanName}"::${pgType}`,
              );
            }

            // Change Nullability
            if (col.nullable !== current.nullable) {
              if (col.nullable) {
                alterQueries.push(`ALTER COLUMN "${cleanName}" DROP NOT NULL`);
              } else {
                alterQueries.push(`ALTER COLUMN "${cleanName}" SET NOT NULL`);
              }
            }

            // Change Default
            if (col.defaultValue !== current.defaultValue) {
              if (col.defaultValue) {
                alterQueries.push(
                  `ALTER COLUMN "${cleanName}" SET DEFAULT ${col.defaultValue}`,
                );
              } else {
                alterQueries.push(`ALTER COLUMN "${cleanName}" DROP DEFAULT`);
              }
            }

            // Handle Foreign Key changes
            const currentFk = current.foreignKey;
            const newIsFk = Boolean(col.isForeignKey && col.referenceTable && col.referenceColumn);
            
            if (newIsFk || currentFk) {
              const cleanRefTable = col.referenceTable?.replace(/[^a-zA-Z0-9_]/g, "");
              const cleanRefCol = col.referenceColumn?.replace(/[^a-zA-Z0-9_]/g, "");
              
              const isDifferent = 
                 (!currentFk && newIsFk) || 
                 (currentFk && !newIsFk) ||
                 (currentFk && newIsFk && (currentFk.table !== cleanRefTable || currentFk.column !== cleanRefCol));
                 
              if (isDifferent) {
                // Drop existing if any
                if (currentFk && currentFk.constraint) {
                  alterQueries.push(`DROP CONSTRAINT "${currentFk.constraint}"`);
                }
                
                // Add new if needed
                if (newIsFk) {
                   const constraintName = `${cleanTable}_${cleanName}_fkey_${Date.now()}`;
                   alterQueries.push(`ADD CONSTRAINT "${constraintName}" FOREIGN KEY ("${cleanName}") REFERENCES "${cleanRefTable}"("${cleanRefCol}")`);
                }
              }
            }
          }
        }
      }

      // 2. Handle Deleted Columns
      for (const current of currentColumns) {
        const stillExists = columns.some(
          (c) => c.originalName === current.name || c.name === current.name,
        );
        if (!stillExists) {
          alterQueries.push(
            `DROP COLUMN "${current.name.replace(/[^a-zA-Z0-9_]/g, "")}"`,
          );
        }
      }

      if (alterQueries.length > 0) {
        const finalQuery = `ALTER TABLE "${cleanTable}" ${alterQueries.join(", ")};`;
        await query(finalQuery);
      }
    } catch (error) {
      console.error(`Error altering table ${tableName}:`, error);
      throw error;
    }
  }
  async getDatabaseStats(): Promise<{
    tableCount: number;
    rowCount: number;
  }> {
    try {
      const result = await query(`
        WITH table_count AS (
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
        ),
        row_count AS (
          SELECT COALESCE(SUM(n_live_tup), 0) as count 
          FROM pg_stat_user_tables
        )
        SELECT 
          (SELECT count FROM table_count) as table_count,
          (SELECT count FROM row_count) as row_count;
      `);

      return {
        tableCount: parseInt(result.rows[0].table_count, 10),
        rowCount: parseInt(result.rows[0].row_count, 10),
      };
    } catch (error) {
      console.error("Error fetching database stats:", error);
      return { tableCount: 0, rowCount: 0 };
    }
  }
}

export const tableService = new TableServiceImpl();
