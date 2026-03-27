import { updateTableStructure } from "@/modules/tables/infrastructure/sa/tabla.sa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Column } from "../../domain/entity/column";
import { CreateTableForm } from "../types/create-table-form";

interface Props {
  tableName: string;
  columns: Column[];
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function useFormTableConfig({
  tableName,
  columns,
  onOpenChange,
  onSuccess,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { register, control, handleSubmit, watch, setValue, reset } =
    useForm<CreateTableForm>({
      defaultValues: {
        tableName: tableName,
        columns: columns.map((col) => ({
          name: col.name,
          originalName: col.name,
          type: col.type,
          nullable: col.nullable,
          defaultValue: col.defaultValue || "",
          primaryKey: col.primaryKey,
          isForeignKey: !!col.foreignKey,
          referenceTable: col.foreignKey?.table || "",
          referenceColumn: col.foreignKey?.column || "",
        })),
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit = async (data: CreateTableForm) => {
    const invalidFks = data.columns.some(
      (c) => c.isForeignKey && (!c.referenceTable || !c.referenceColumn)
    );
    if (invalidFks) {
      toast.error("Debe seleccionar tabla y columna para las llaves foráneas.");
      return;
    }

    setLoading(true);
    try {
      const result = await updateTableStructure(tableName, data.columns);

      if (result.success) {
        toast.success("Estructura de la tabla actualizada correctamente");
        onOpenChange(false);
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(result.error || "Error al actualizar la tabla");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado al actualizar la tabla");
    } finally {
      setLoading(false);
    }
  };

  const addColumn = (type: string) => {
    append({
      name: "",
      type,
      nullable: true,
      defaultValue: "",
      primaryKey: false,
    });
    setIsPopoverOpen(false);
  };

  function handleOpenChange(open: boolean) {
    onOpenChange(open);
    if (!open) {
      reset();
    }
  }

  return {
    register,
    handleSubmit,
    onSubmit,
    watch,
    setValue,
    fields,
    remove,
    addColumn,
    handleOpenChange,
    loading,
    isPopoverOpen,
    setIsPopoverOpen,
  };
}
