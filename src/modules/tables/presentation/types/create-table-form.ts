export interface CreateTableForm {
  tableName: string;
  columns: CreateTableFormColumn[];
}

export interface CreateTableFormColumn {
  name: string;
  originalName?: string;
  type: string;
  nullable: boolean;
  defaultValue: string;
  primaryKey: boolean;
  isForeignKey?: boolean;
  referenceTable?: string;
  referenceColumn?: string;
}
