"use client";

import { POSTGRES_TYPES } from "@/modules/tables/domain/constants/postgres-types";
import { Column } from "@/modules/tables/domain/entity/column";
import { ButtonLoading } from "@/shared/presentation/components/button/button-loading";
import { Button } from "@/shared/presentation/components/ui/button";
import { Label } from "@/shared/presentation/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/presentation/components/ui/popover";
import { ScrollArea } from "@/shared/presentation/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/presentation/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/presentation/components/ui/tabs";
import { Check, Copy, Plus, Settings, TableProperties } from "lucide-react";
import { useState } from "react";
import { DeleteTable } from "../components/buttons/delete-table";
import { CreateColumn } from "../components/create-table/create-column";
import { TypeIconColumn } from "../components/type-icon-column";
import { useFormTableConfig } from "../hooks/use-form-table-config";
import { mockColumn } from "../mapper/column.mapper";

interface TableConfigProps {
  tableName: string;
  columns: Column[];
}

const generateTableSQL = (tableName: string, columns: Column[]) => {
  let sql = `CREATE TABLE "${tableName}" (\n`;
  const colDefs = columns.map((col) => {
    let def = `  "${col.name}" ${col.type}`;
    if (!col.nullable) def += " NOT NULL";
    if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
    return def;
  });

  const pks = columns.filter((c) => c.primaryKey).map((c) => `"${c.name}"`);
  if (pks.length > 0) {
    colDefs.push(`  PRIMARY KEY (${pks.join(", ")})`);
  }

  columns.forEach((c) => {
    if (c.foreignKey) {
      colDefs.push(
        `  FOREIGN KEY ("${c.name}") REFERENCES "${c.foreignKey.table}"("${c.foreignKey.column}")`,
      );
    }
  });

  sql += colDefs.join(",\n");
  sql += "\n);";
  return sql;
};

export function TableConfig({ tableName, columns }: TableConfigProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const sqlCode = generateTableSQL(tableName, columns);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    fields,
    remove,
    addColumn,
    handleOpenChange,
    loading,
    isPopoverOpen,
    setIsPopoverOpen,
    onSubmit,
  } = useFormTableConfig({
    tableName,
    columns,
    onOpenChange: setIsOpen,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Configurar
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col p-0 gap-0 bg-background"
      >
        <SheetHeader className="px-6 py-4 border-b bg-muted/30 shrink-0">
          <div className="flex items-center justify-between mb-1 gap-4">
            <div className="flex items-center gap-2">
              <TableProperties className="size-5 text-primary shrink-0" />
              <SheetTitle className="text-xl font-bold truncate">
                Configurar Tabla: {tableName}
              </SheetTitle>
            </div>
            <DeleteTable tableName={tableName} />
          </div>
          <SheetDescription>
            Administre la estructura y campos de su tabla de base de datos.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Tabs defaultValue="fields" className="flex-1 flex flex-col h-full">
            <div className="px-6 pt-4 border-b">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="fields" className="w-1/2">
                  Campos
                </TabsTrigger>
                <TabsTrigger value="sql" className="w-1/2">
                  SQL
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="fields" className="flex-1 min-h-0 flex flex-col outline-none data-[state=active]:flex">
              <ScrollArea className="flex-1 min-h-0 w-full">
                <form
                  id="table-config-form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 px-6 py-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold text-base text-muted-foreground">
                        Columnas actuales
                      </Label>
                    </div>

                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <CreateColumn
                          key={field.id}
                          index={index}
                          field={field}
                          watch={watch}
                          setValue={setValue}
                          register={register}
                          remove={remove}
                        />
                      ))}

                      <div className="pt-2">
                        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={true}>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full gap-2 border-dashed h-12 text-muted-foreground hover:text-foreground cursor-pointer"
                            >
                              <Plus className="size-4" /> Agregar Columna
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-(--radix-popover-trigger-width) p-2" align="center">
                            <ScrollArea className="h-[300px] w-full pr-3">
                              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {POSTGRES_TYPES.map((type) => (
                                  <Button
                                    key={type}
                                    variant="ghost"
                                    className="justify-start gap-3 rounded-sm hover:bg-muted"
                                    onClick={() => addColumn(type)}
                                  >
                                    <TypeIconColumn
                                      column={mockColumn(type)}
                                      className="size-4 shrink-0 text-muted-foreground"
                                    />
                                    <span className="truncate flex-1 text-left">
                                      {type}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </ScrollArea>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </form>
              </ScrollArea>

              <SheetFooter className="px-6 py-4 border-t bg-muted/30 shrink-0 flex flex-row justify-end gap-2 shadow-sm mt-auto">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>

                <ButtonLoading
                  type="submit"
                  form="table-config-form"
                  disabled={loading}
                  className="min-w-[130px] cursor-pointer"
                >
                  Guardar Cambios
                </ButtonLoading>
              </SheetFooter>
            </TabsContent>

            <TabsContent value="sql" className="flex-1 min-h-0 outline-none p-6">
              <div className="relative group h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium text-muted-foreground">Vista previa del SQL de creación</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-2 bg-background"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <><Check className="h-4 w-4 text-green-500" /> Copiado</>
                    ) : (
                      <><Copy className="h-4 w-4 text-muted-foreground" /> Copiar</>
                    )}
                  </Button>
                </div>
                <div className="flex-1 rounded-md bg-muted/50 p-4 border overflow-auto font-mono text-sm text-muted-foreground">
                  <pre>
                    <code>{sqlCode}</code>
                  </pre>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
