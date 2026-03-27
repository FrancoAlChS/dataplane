"use client";
import { Column } from "@/modules/tables/domain/entity/column";
import { useRecordModal } from "@/modules/tables/presentation/context/record-modal-context";
import { TableConfig } from "@/modules/tables/presentation/sections/table-config";
import { Button } from "@/shared/presentation/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  name: string;
  totalCount: number;
  columns: Column[];
}

export function TableDetailHeader({ name, totalCount, columns }: Props) {
  const { openCreate } = useRecordModal();

  return (
    <div className="w-full border-b border-border/50 px-4 py-2 flex items-center justify-between bg-card/30 shrink-0">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-semibold tracking-tight capitalize flex items-center gap-2">
          <span className="text-muted-foreground/50">Table:</span>
          {name}
        </h2>
        <div className="h-4 w-px bg-border/50 mx-2" />
        <p className="text-[11px] text-muted-foreground tabular-nums">
          <span className="font-medium text-foreground/70">{totalCount}</span> records
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" className="h-7 text-xs gap-1.5 bg-primary hover:bg-primary/90 text-white px-3" onClick={openCreate}>
          <Plus className="size-3.5" />
          <span>New Record</span>
        </Button>
        <TableConfig tableName={name} columns={columns} />
      </div>
    </div>
  );
}
