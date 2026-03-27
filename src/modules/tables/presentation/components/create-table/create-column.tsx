"use client";

import { getColumns, getTables } from "@/modules/tables/infrastructure/sa/tabla.sa";
import { Button } from "@/shared/presentation/components/ui/button";
import { Checkbox } from "@/shared/presentation/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
} from "@/shared/presentation/components/ui/collapsible";
import { Input } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/presentation/components/ui/select";
import { cn } from "@/shared/presentation/lib/utils";
import { Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { mockColumn } from "../../mapper/column.mapper";
import { CreateTableForm } from "../../types/create-table-form";
import { TypeIconColumn } from "../type-icon-column";

interface CreateColumnProps {
  index: number;
  field: FieldArrayWithId<CreateTableForm, "columns", "id">;
  watch: UseFormWatch<CreateTableForm>;
  setValue: UseFormSetValue<CreateTableForm>;
  register: UseFormRegister<CreateTableForm>;
  remove: UseFieldArrayRemove;
}

export function CreateColumn({
  index,
  field,
  watch,
  setValue,
  register,
  remove,
}: CreateColumnProps) {
  const [open, setOpen] = useState(false);
  const [tables, setTables] = useState<{name: string}[]>([]);
  const [refColumns, setRefColumns] = useState<{name: string}[]>([]);

  const type = watch(`columns.${index}.type`);
  const isPk = watch(`columns.${index}.primaryKey`);
  const isFk = watch(`columns.${index}.isForeignKey`);
  const refTable = watch(`columns.${index}.referenceTable`);

  useEffect(() => {
    if (isFk && tables.length === 0) {
      getTables().then((res) => setTables(res));
    }
  }, [isFk, tables.length]);

  useEffect(() => {
    if (isFk && refTable) {
      getColumns(refTable).then((res) => setRefColumns(res));
    }
  }, [isFk, refTable]);

  return (
    <div
      key={field.id}
      className={cn(
        "p-3 rounded-lg shadow-sm border transition-all bg-card",
        open
          ? "ring-1 ring-ring border-transparent"
          : "hover:border-primary/50",
      )}
    >
      <div className="flex justify-between items-center gap-3">
        <div
          className="flex items-center justify-center p-2 rounded-md bg-muted shrink-0 text-muted-foreground"
          title={type}
        >
          <TypeIconColumn column={mockColumn(type, isPk)} className="size-4" />
        </div>

        <div className="flex-1">
          <Input
            placeholder="Nombre del campo"
            className="h-10 border-0 shadow-none bg-transparent focus-visible:ring-1 focus-visible:ring-primary px-2 font-medium"
            {...register(`columns.${index}.name`, {
              required: true,
            })}
          />
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant={open ? "secondary" : "ghost"}
            size="icon"
            onClick={() => setOpen(!open)}
            className="cursor-pointer h-9 w-9 rounded-md"
          >
            <Settings
              className={cn(
                "size-4 text-muted-foreground transition-transform duration-200",
                open && "rotate-90",
              )}
            />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="transition cursor-pointer h-9 w-9 rounded-md text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              remove(index);
              if (open) setOpen(false);
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <Collapsible open={open}>
        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="pt-4 mt-2 border-t border-dashed space-y-4">
            <div className="flex-1 flex flex-col gap-1.5 ml-auto">
              <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Valor por defecto
              </Label>
              <Input
                className="h-9 text-sm"
                placeholder="Ej: now(), 0, 'activo'"
                {...register(`columns.${index}.defaultValue`)}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6  pb-2">
              <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-md border">
                <Checkbox
                  id={`null-${index}`}
                  checked={watch(`columns.${index}.nullable`)}
                  onCheckedChange={(val) =>
                    setValue(`columns.${index}.nullable`, val === true)
                  }
                />
                <Label
                  htmlFor={`null-${index}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  Permitir Nulos (Nullable)
                </Label>
              </div>

              <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-md border">
                <Checkbox
                  id={`pk-${index}`}
                  checked={isPk}
                  onCheckedChange={(val) =>
                    setValue(`columns.${index}.primaryKey`, val === true)
                  }
                />
                <Label
                  htmlFor={`pk-${index}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  Clave Primaria (PK)
                </Label>
              </div>
              <div className="flex items-center gap-2 bg-muted/30 px-3 py-2 rounded-md border">
                <Checkbox
                  id={`fk-${index}`}
                  checked={isFk}
                  onCheckedChange={(val) =>
                    setValue(`columns.${index}.isForeignKey`, val === true)
                  }
                />
                <Label
                  htmlFor={`fk-${index}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  Llave Foránea (FK)
                </Label>
              </div>
            </div>

            {isFk && (
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 pb-2 border-t pt-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Tabla Referencia</Label>
                  <Select 
                    value={refTable || ""}
                    onValueChange={(val) => {
                       setValue(`columns.${index}.referenceTable`, val);
                       setValue(`columns.${index}.referenceColumn`, "");
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Seleccione una tabla" />
                    </SelectTrigger>
                    <SelectContent>
                      {tables.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Columna Referencia</Label>
                  <Select 
                    value={watch(`columns.${index}.referenceColumn`) || ""}
                    onValueChange={(val) => {
                       setValue(`columns.${index}.referenceColumn`, val);
                    }}
                    disabled={!refTable || refColumns.length === 0}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Seleccione una columna" />
                    </SelectTrigger>
                    <SelectContent>
                      {refColumns.map(c => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
