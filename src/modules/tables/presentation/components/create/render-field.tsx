import { Column } from "@/modules/tables/domain/entity/column";
import { Label } from "@/shared/presentation/components/ui/label";
import { Switch } from "@/shared/presentation/components/ui/switch";
import { useFormCreateContext } from "../../context/form-create-context";
import { SelectField } from "./select-field";

interface Props {
  column: Column;
}

export function RenderField({ column }: Props) {
  const { excludedFields, toggleExcludeField } = useFormCreateContext();
  const hasDefault =
    column.defaultValue !== undefined &&
    column.defaultValue !== null &&
    column.defaultValue !== "";
  const isReadonly = column.isAutoincrement;
  const isExcluded = excludedFields.has(column.name);

  return (
    <div key={column.name} className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs font-bold uppercase tracking-wider">
          {column.name}{" "}
          {!column.nullable && !isReadonly && !isExcluded && (
            <span className="text-destructive">*</span>
          )}
          {column.primaryKey && (
            <span className="ml-1 text-[10px] font-normal normal-case tracking-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded">
              PK
            </span>
          )}
          {isReadonly && (
            <span className="ml-1 text-[10px] font-normal normal-case tracking-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              auto
            </span>
          )}
        </Label>

        <div className="flex items-center gap-2">
          {hasDefault && !isReadonly && (
            <>
              <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md border">
                <span className="text-[10px] font-medium text-muted-foreground">
                  Usar defecto
                </span>
                <Switch
                  checked={isExcluded}
                  onCheckedChange={() => toggleExcludeField(column.name)}
                  className="scale-75 origin-right"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <SelectField column={column} disabled={isExcluded} />

      {column.defaultValue && !isReadonly && (
        <p className="text-[11px] text-muted-foreground">
          Defecto:{" "}
          <code className="bg-muted px-1 py-0.5 rounded text-[10px]">
            {column.defaultValue}
          </code>
        </p>
      )}
    </div>
  );
}
