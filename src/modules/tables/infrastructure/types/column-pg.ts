export interface ColumnPG {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string;
  is_primary_key: boolean;
  is_identity: string;
  foreign_table?: string;
  foreign_column?: string;
  foreign_constraint?: string;
}
