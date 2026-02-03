import { TableType } from "@/shared/domain/enum/table-type";

export interface TablePG {
  table_name: string;
  table_type: TableType;
}

export interface TableColumnPG {
  column_name: string;
  data_type: string;
  is_nullable: boolean;
  column_default: string;
}
