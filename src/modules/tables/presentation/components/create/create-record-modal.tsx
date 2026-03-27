"use client";

import { Column } from "@/modules/tables/domain/entity/column";
import {
  createRecord,
  updateRecord,
} from "@/modules/tables/infrastructure/sa/tabla.sa";
import { RenderField } from "@/modules/tables/presentation/components/create/render-field";
import { useFormCreateContext } from "@/modules/tables/presentation/context/form-create-context";
import { ButtonLoading } from "@/shared/presentation/components/button/button-loading";
import { Button } from "@/shared/presentation/components/ui/button";
import { ScrollArea } from "@/shared/presentation/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/presentation/components/ui/sheet";
import { useLoading } from "@/shared/presentation/hooks/use-loading";

import { Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CreateRecordModalProps {
  tableName: string;
  columns: Column[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateRecordModal({
  tableName,
  columns,
  isOpen,
  onOpenChange,
  onSuccess,
}: CreateRecordModalProps) {
  const { formData, initialData, excludedFields, isEditing, resetForm } =
    useFormCreateContext();
  const { loading, startLoading, stopLoading } = useLoading();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startLoading();
    try {
      // Validate & parse JSON fields
      const processedData = { ...formData };

      // Remove excluded fields
      excludedFields.forEach((field) => {
        delete processedData[field];
      });

      for (const col of columns) {
        const raw = processedData[col.name];
        if (
          (col.type.includes("json") || col.type.includes("jsonb")) &&
          typeof raw === "string"
        ) {
          if (raw) {
            try {
              processedData[col.name] = JSON.parse(raw);
            } catch {
              toast.error(`JSON inválido en el campo "${col.name}"`);
              stopLoading();
              return;
            }
          }
        }
      }

      if (isEditing && initialData) {
        // Calculate diff
        const diff: Record<string, unknown> = {};
        let hasChanges = false;

        Object.keys(processedData).forEach((key) => {
          if (
            JSON.stringify(processedData[key]) !==
            JSON.stringify(initialData[key])
          ) {
            diff[key] = processedData[key];
            hasChanges = true;
          }
        });

        if (!hasChanges) {
          toast.info("No hay cambios para actualizar");
          onOpenChange(false);
          resetForm();
          stopLoading();
          return;
        }

        // Primary key conditions
        const primaryColumns = columns.filter((col) => col.primaryKey);
        const conditions: Record<string, unknown> = {};
        primaryColumns.forEach((col) => {
          conditions[col.name] = initialData[col.name];
        });

        const result = await updateRecord(tableName, conditions, diff);
        if (result.success) {
          toast.success("Registro actualizado exitosamente");
          onOpenChange(false);
          resetForm();
          onSuccess?.();
          router.refresh();
        } else {
          toast.error(result.error ?? "Error al actualizar el registro");
        }
      } else {
        const result = await createRecord(tableName, processedData);
        if (result.success) {
          toast.success("Registro creado exitosamente");
          onOpenChange(false);
          resetForm();
          onSuccess?.();
          router.refresh();
        } else {
          toast.error(result.error ?? "Error al crear el registro");
        }
      }
    } catch {
      toast.error("Ocurrió un error inesperado");
    } finally {
      stopLoading();
    }
  };

  function handleOpenChange(open: boolean) {

    resetForm();
    onOpenChange(open)
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg flex flex-col p-0 gap-0"
      >
        <SheetHeader className="px-6 py-4 border-b bg-muted/30 shrink-0">
          <SheetTitle className="flex items-center gap-2">
            {isEditing ? (
              <Edit className="size-5 text-primary" />
            ) : (
              <Plus className="size-5 text-primary" />
            )}
            <span>
              {isEditing ? "Editar" : "Nuevo"} registro en{" "}
              <span className="capitalize font-bold">{tableName}</span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 min-h-0 h-full">
          <form
            id="create-record-form"
            onSubmit={handleSubmit}
            className="space-y-5 px-6 py-6"
          >
            {columns.map((column) => (
              <RenderField key={column.name} column={column} />
            ))}
          </form>
        </ScrollArea>

        <SheetFooter className="px-6 py-4 border-t bg-muted/30 shrink-0 flex flex-row justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <ButtonLoading
            type="submit"
            form="create-record-form"
            disabled={loading}
            className="min-w-[130px]"
          >
            {isEditing ? "Actualizar Registro" : "Guardar Registro"}
          </ButtonLoading>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
