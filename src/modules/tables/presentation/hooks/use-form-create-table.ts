import { createNewTable } from "@/modules/tables/infrastructure/sa/tabla.sa";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateTableForm } from "../types/create-table-form";

interface Props {
  onOpenChange: (open: boolean) => void;
}

export function useFormCreateTable({ onOpenChange }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
  } = useForm<CreateTableForm>({
    defaultValues: {
      tableName: "",
      columns: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "columns",
  });

  const onSubmit = async (data: CreateTableForm) => {
    if (!data.tableName.trim()) {
      toast.error("El nombre de la tabla es obligatorio");
      return;
    }
    if (data.columns.length === 0) {
      toast.error("Debe agregar al menos una columna");
      return;
    }
    
    const invalidFks = data.columns.some(
      (c) => c.isForeignKey && (!c.referenceTable || !c.referenceColumn)
    );
    if (invalidFks) {
      toast.error("Debe seleccionar tabla y columna para las llaves foráneas.");
      return;
    }

    setLoading(true);
    try {
      const result = await createNewTable(data.tableName, data.columns);

      if (result.success) {
        toast.success("Tabla creada exitosamente");
        reset();
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error ?? "Error al crear la tabla");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
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
    reset();
  }

  return {
    register,
    watch,
    setValue,
    fields,
    remove,
    addColumn,
    handleOpenChange,
    loading,
    isPopoverOpen,
    setIsPopoverOpen,
    handleSubmit,
    onSubmit,
  };
}
