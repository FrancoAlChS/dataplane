"use server";

import { tableService } from "@/modules/tables/infrastructure/service/table.service";
import { revalidatePath } from "next/cache";

export async function getTables() {
  return tableService.getTables();
}

export async function getColumns(tableName: string) {
  return tableService.getColumns(tableName);
}

export async function createNewTable(
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
) {
  try {
    await tableService.createTable(tableName, columns);
    revalidatePath("/tables");
    return { success: true, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error creating table";
    return { success: false, error: message };
  }
}

export async function getData(
  tableName: string,
  page: number = 1,
  limit: number = 30,
  sortColumn?: string,
  sortOrder?: "asc" | "desc",
  filter?: string,
) {
  try {
    const data = await tableService.getData(
      tableName,
      page,
      limit,
      sortColumn,
      sortOrder,
      filter,
    );
    return { data, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error executing query";
    return { data: [], error: message };
  }
}

export async function getTotalCount(tableName: string, filter?: string) {
  return tableService.getTotalCount(tableName, filter);
}

export async function getRecordByValue(
  tableName: string,
  columnName: string,
  value: unknown,
) {
  return tableService.getRecordByValue(tableName, columnName, value);
}

export async function createRecord(
  tableName: string,
  data: Record<string, unknown>,
) {
  try {
    await tableService.createRecord(tableName, data);
    return { success: true, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error creating record";
    return { success: false, error: message };
  }
}

export async function updateRecord(
  tableName: string,
  conditions: Record<string, unknown>,
  data: Record<string, unknown>,
) {
  try {
    await tableService.updateRecord(tableName, conditions, data);
    return { success: true, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error updating record";
    return { success: false, error: message };
  }
}

export async function deleteRecords(
  tableName: string,
  records: Record<string, unknown>[],
) {
  try {
    await tableService.deleteRecords(tableName, records);
    return { success: true, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error deleting records";
    return { success: false, error: message };
  }
}

export async function deleteTable(tableName: string) {
  try {
    await tableService.dropTable(tableName);
    return { success: true, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error deleting table";
    return { success: false, error: message };
  }
}
export async function updateTableStructure(
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
) {
  try {
    await tableService.alterTable(tableName, columns);
    return { success: true, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Error updating table structure";
    return { success: false, error: message };
  }
}
