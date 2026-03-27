"use client";

import { Table } from "@/modules/tables/domain/entity/table";
import { TableSheet } from "@/modules/tables/presentation/components/create-table/table-sheet";
import { Button } from "@/shared/presentation/components/ui/button";
import { Input } from "@/shared/presentation/components/ui/input";
import { ScrollArea } from "@/shared/presentation/components/ui/scroll-area";
import { useModal } from "@/shared/presentation/hooks/use-modal";
import { Plus, TableProperties } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface TableSearchListProps {
  initialTables: Table[];
}

export function TableSearchList({ initialTables }: TableSearchListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, open, toggle } = useModal();
  const pathname = usePathname();

  const filteredTables = initialTables.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="w-full flex px-4 py-4 shrink-0 border-b">
        <Input
          placeholder="Buscar tabla..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="max-w-64 flex-1 w-full min-h-0">
        <div className="max-w-64 w-full flex flex-col gap-1.5 p-3 ">
          {filteredTables.map((table) => (
            <Link
              key={table.name}
              className={`w-full flex items-center hover:bg-primary/8 hover:text-white text-gray-400 rounded-md py-1.5 px-3 gap-2 text-sm transition-colors ${pathname === `/tables/${table.name}` ? "bg-primary/8 text-white" : ""}`}
              href={`/tables/${table.name}`}
            >
              <TableProperties className="size-4 shrink-0" />
              <span className="truncate font-medium">{table.name}</span>
            </Link>
          ))}

          {filteredTables.length === 0 && (
            <span className="text-xs text-muted-foreground px-3 py-2 italic text-center">
              No se encontraron tablas
            </span>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-muted/20 shrink-0">
        <Button
          variant="outline"
          className="w-full cursor-pointer"
          onClick={open}
        >
          <Plus className="size-4" />
          Crear Tabla
        </Button>
      </div>

      <TableSheet isOpen={isOpen} onOpenChange={toggle} />
    </div>
  );
}
