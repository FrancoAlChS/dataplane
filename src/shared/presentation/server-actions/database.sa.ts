import { databaseService } from "@/shared/infrastructure/service/database.service";

export async function getTables() {
  return databaseService.getTables();
}

export async function getTableColumns(tableName: string) {
  return databaseService.getTableColumns(tableName);
}

export async function getTableData(
  tableName: string,
  page: number = 1,
  limit: number = 30,
  sortColumn?: string,
  sortOrder?: "asc" | "desc",
) {
  return databaseService.getTableData(
    tableName,
    page,
    limit,
    sortColumn,
    sortOrder,
  );
}
