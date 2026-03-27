import { Column } from "@/modules/tables/domain/entity/column";
import { cn } from "@/shared/presentation/lib/utils";
import {
  Braces,
  Brackets,
  Calendar,
  CalendarClock,
  Clock,
  Hash,
  KeyRound,
  ToggleLeft,
  Type,
  Waypoints,
} from "lucide-react";

interface Props {
  column: Column;
  className?: string;
}

export function TypeIconColumn({ column, className }: Props) {
  if (column.primaryKey) {
    return <KeyRound className={cn("h-4 w-4 text-yellow-600", className)} />;
  }

  if (column.foreignKey) {
    return <Waypoints className={cn("h-4 w-4 text-blue-600", className)} />;
  }

  const type = column.type.toLowerCase();

  if (
    type.includes("int") ||
    type.includes("decimal") ||
    type.includes("numeric") ||
    type.includes("real") ||
    type.includes("double") ||
    type.includes("serial") ||
    type.includes("bigserial")
  ) {
    return <Hash className={cn("h-4 w-4 text-muted-foreground", className)} />;
  }

  if (type.includes("json")) {
    return (
      <Braces className={cn("h-4 w-4 text-muted-foreground", className)} />
    );
  }

  if (type.includes("array") || type.endsWith("[]")) {
    return (
      <Brackets className={cn("h-4 w-4 text-muted-foreground", className)} />
    );
  }

  if (type.includes("timestamp") || type.includes("timestamptz")) {
    return (
      <CalendarClock
        className={cn("h-4 w-4 text-muted-foreground", className)}
      />
    );
  }

  if (type.includes("date")) {
    return (
      <Calendar className={cn("h-4 w-4 text-muted-foreground", className)} />
    );
  }

  if (type.includes("time")) {
    return <Clock className={cn("h-4 w-4 text-muted-foreground", className)} />;
  }

  if (type.includes("bool")) {
    return (
      <ToggleLeft className={cn("h-4 w-4 text-muted-foreground", className)} />
    );
  }

  // Default for text types like varchar, text, etc.
  return <Type className={cn("h-4 w-4 text-muted-foreground", className)} />;
}
