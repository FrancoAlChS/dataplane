export class Column {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string;
  primaryKey: boolean;
  isAutoincrement: boolean;
  foreignKey?: {
    table: string;
    column: string;
    constraint?: string;
  };
}
