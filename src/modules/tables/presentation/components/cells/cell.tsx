"use client";

import { Column } from "@/modules/tables/domain/entity/column";
import { format, isValid } from "date-fns";
import { CellSpecial } from "./cell-special";

interface CellProps {
  column: Column;
  value: unknown;
}

export function Cell({ column, value }: CellProps) {
  const isPrimary = column.primaryKey;
  const hasForeignKey = !!column.foreignKey;

  if (value === null || value === undefined) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground italic text-xs">null</span>
      </div>
    );
  }

  const type = column.type.toLowerCase();
  let displayValue = "";

  if (
    typeof value === "object" &&
    !type.includes("timestamp") &&
    !type.includes("date") &&
    !type.includes("timestamptz")
  ) {
    displayValue = JSON.stringify(value);
  } else {
    // Date and DateTime formatting
    if (type.includes("timestamp") || type.includes("timestamptz")) {
      if (value instanceof Date && isValid(value)) {
        displayValue = format(value, "dd-MM-yyyy HH:mm:ss");
      } else {
        displayValue = String(value);
      }
    } else if (type.includes("date")) {
      if (value instanceof Date && isValid(value)) {
        displayValue = format(value, "dd-MM-yyyy");
      } else {
        displayValue = String(value);
      }
    } else {
      displayValue = String(value);
    }
  }

  return (
    <div className="flex items-center gap-2 truncate whitespace-nowrap">
      {isPrimary || hasForeignKey ? (
        <CellSpecial
          value={displayValue}
          isForeignKey={hasForeignKey}
          column={column}
        />
      ) : (
        displayValue
      )}
    </div>
  );
}
