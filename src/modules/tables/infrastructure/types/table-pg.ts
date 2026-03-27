import { TableType } from "../../domain/enum/table-type";

export interface TablePG {
  table_name: string;
  table_type: TableType;
}
