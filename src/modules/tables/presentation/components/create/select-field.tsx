import { ArrayInput } from "@/modules/tables/presentation/components/cells/array-input";
import { JsonTextArea } from "@/modules/tables/presentation/components/cells/json-textarea";
import { RelationSelect } from "@/modules/tables/presentation/components/cells/relation-select";
import { DatePicker } from "@/shared/presentation/components/ui/date-picker";
import { Input } from "@/shared/presentation/components/ui/input";
import { Switch } from "@/shared/presentation/components/ui/switch";
import { useFormCreateContext } from "../../context/form-create-context";
import { Column } from "@/modules/tables/domain/entity/column";

interface Props {
  column: Column;
  disabled?: boolean;
}

function parsePostgresArray(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return [];

  const str = value.trim();
  if (!str.startsWith("{") || !str.endsWith("}")) return [str].filter(Boolean);

  // Simple parser for "{a,b,c}"
  return str
    .slice(1, -1)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function SelectField({ column, disabled }: Props) {
  const { formData, handleFieldChange } = useFormCreateContext();

  const value = formData[column.name];
  const isReadonly = column.isAutoincrement || disabled;

  if (column.isAutoincrement) {
    return (
      <Input
        value="(auto-generado)"
        readOnly
        disabled
        className="bg-muted/50 text-muted-foreground italic"
      />
    );
  }

  if (column.foreignKey) {
    return (
      <RelationSelect
        tableName={column.foreignKey.table}
        columnName={column.foreignKey.column}
        value={typeof value === "string" ? value : ""}
        onChange={(v) => handleFieldChange(column.name, v)}
        placeholder={`Seleccionar de ${column.foreignKey.table}...`}
        disabled={isReadonly}
      />
    );
  }

  if (column.type === "boolean") {
    return (
      <div className="flex items-center space-x-2">
        <Switch
          checked={!!value}
          onCheckedChange={(v) => handleFieldChange(column.name, v)}
          disabled={isReadonly}
        />
        <span className="text-sm text-muted-foreground">
          {value ? "Verdadero" : "Falso"}
        </span>
      </div>
    );
  }

  if (column.type.includes("timestamp") || column.type === "date") {
    return (
      <DatePicker
        date={
          value instanceof Date
            ? value
            : value
              ? new Date(String(value))
              : undefined
        }
        onChange={(d) => handleFieldChange(column.name, d?.toISOString())}
        disabled={isReadonly}
      />
    );
  }

  if (column.type.includes("json")) {
    const jsonStr =
      typeof value === "string"
        ? value
        : value !== undefined
          ? JSON.stringify(value, null, 2)
          : "";
    return (
      <JsonTextArea
        value={jsonStr}
        onChange={(v) => handleFieldChange(column.name, v)}
        placeholder='{"key": "value"}'
        disabled={isReadonly}
      />
    );
  }

  if (column.type.includes("[]") || column.type == "ARRAY") {
    const arrayValue = parsePostgresArray(value);
    return (
      <ArrayInput
        value={arrayValue}
        onChange={(v) => handleFieldChange(column.name, v)}
        disabled={isReadonly}
      />
    );
  }

  return (
    <Input
      type={
        column.type.includes("int") || column.type === "numeric"
          ? "number"
          : "text"
      }
      value={
        typeof value === "string" || typeof value === "number"
          ? String(value)
          : ""
      }
      onChange={(e) => handleFieldChange(column.name, e.target.value)}
      placeholder={`Ingresar ${column.name}...`}
      required={!column.nullable && !column.isAutoincrement && !disabled}
      readOnly={isReadonly}
      disabled={isReadonly}
    />
  );
}
