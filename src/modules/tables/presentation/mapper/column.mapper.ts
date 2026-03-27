import { Column } from "@/modules/tables/domain/entity/column";

export function mockColumn(type: string, primaryKey = false): Column {
  return {
    type,
    name: "",
    nullable: true,
    primaryKey,
    isAutoincrement: false,
    defaultValue: "",
  };
}
