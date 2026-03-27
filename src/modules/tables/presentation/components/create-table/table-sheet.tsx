"use client";

import { POSTGRES_TYPES } from "@/modules/tables/domain/constants/postgres-types";
import { ButtonLoading } from "@/shared/presentation/components/button/button-loading";
import { Button } from "@/shared/presentation/components/ui/button";
import { Input } from "@/shared/presentation/components/ui/input";
import { Label } from "@/shared/presentation/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/presentation/components/ui/popover";
import { ScrollArea } from "@/shared/presentation/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/presentation/components/ui/sheet";
import { Plus, TableProperties } from "lucide-react";
import { useFormCreateTable } from "../../hooks/use-form-create-table";
import { mockColumn } from "../../mapper/column.mapper";
import { TypeIconColumn } from "../type-icon-column";
import { CreateColumn } from "./create-column";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TableSheet({ isOpen, onOpenChange }: Props) {
  const {
    loading,
    fields,
    register,
    watch,
    setValue,
    remove,
    handleOpenChange,
    isPopoverOpen,
    setIsPopoverOpen,
    handleSubmit,
    addColumn,
    onSubmit,
  } = useFormCreateTable({ onOpenChange });

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl flex flex-col p-0 gap-0 bg-background"
      >
        <SheetHeader className="px-6 py-4 border-b bg-muted/30 shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <TableProperties className="size-5 text-primary" />
            <span>Crear Nueva Tabla</span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0 h-full">
          <form
            id="create-table-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 px-6 py-6"
          >
            <div className="space-y-2">
              <Label htmlFor="tableName" className="font-semibold text-base">
                Nombre de la Tabla <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tableName"
                placeholder="Ejemplo: usuarios, productos..."
                {...register("tableName", { required: true })}
                className="max-w-md shadow-sm"
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-base">
                  Columnas de la tabla
                </Label>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => {
                  return (
                    <CreateColumn
                      key={field.id}
                      index={index}
                      field={field}
                      watch={watch}
                      setValue={setValue}
                      register={register}
                      remove={remove}
                    />
                  );
                })}

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

        <SheetFooter className="px-6 py-4 border-t bg-muted/30 shrink-0 flex flex-row justify-end gap-2 shadow-sm">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="cursor-pointer"
          >
            Cancelar
          </Button>

          <ButtonLoading
            type="submit"
            form="create-table-form"
            disabled={loading}
            className="min-w-[130px] cursor-pointer"
          >
            Crear Tabla
          </ButtonLoading>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
