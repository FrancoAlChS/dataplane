"use client";

import { TableHead } from "@/shared/presentation/components/ui/table";
import { cn } from "@/shared/presentation/lib/utils";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface SortableHeaderProps {
  column: string;
  currentSort?: string;
  currentOrder?: "asc" | "desc";
  children: React.ReactNode;
}

export function SortableHeader({
  column,
  currentSort,
  currentOrder,
  children,
}: SortableHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentSort === column) {
      if (currentOrder === "asc") {
        params.set("sort", column);
        params.set("order", "desc");
      } else if (currentOrder === "desc") {
        params.delete("sort");
        params.delete("order");
      } else {
        params.set("sort", column);
        params.set("order", "asc");
      }
    } else {
      params.set("sort", column);
      params.set("order", "asc");
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <TableHead
      onClick={handleSort}
      className={cn(
        "cursor-pointer hover:bg-muted/50 transition-colors select-none",
      )}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        {currentSort === column ? (
          currentOrder === "asc" ? (
            <ArrowUp className="h-4 w-4" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="h-4 w-4 opacity-50" />
        )}
      </div>
    </TableHead>
  );
}
