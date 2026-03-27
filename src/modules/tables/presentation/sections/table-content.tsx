"use client";

import { Column } from "@/modules/tables/domain/entity/column";
import { Cell } from "@/modules/tables/presentation/components/cells/cell";
import { SortableHeader } from "@/modules/tables/presentation/components/table/sortable-header";
import { useRecordModal } from "@/modules/tables/presentation/context/record-modal-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/presentation/components/ui/alert-dialog";
import { Button } from "@/shared/presentation/components/ui/button";
import { Checkbox } from "@/shared/presentation/components/ui/checkbox";
import {
  ScrollArea,
  ScrollBar,
} from "@/shared/presentation/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/presentation/components/ui/table";

import { AlertCircle, Edit, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteRecords, getData } from "../../infrastructure/sa/tabla.sa";
import { RelatedRecordModal } from "../components/relation/related-record-modal";
import { TypeIconColumn } from "../components/type-icon-column";
import { RelationModalProvider } from "../context/relation-modal.context";

export type DataRow = Record<string, unknown>;

interface TableContentProps {
  tableName: string;
  initialData: DataRow[];
  columns: Column[];
  initialTotal: number;
  initialError: string | null;
  currentSort?: string;
  currentOrder?: "asc" | "desc";
  currentWhere?: string;
}

export function TableContent({
  tableName,
  initialData,
  columns,
  initialTotal,
  initialError,
  currentSort,
  currentOrder,
  currentWhere,
}: TableContentProps) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData.length < initialTotal);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [deleting, setDeleting] = useState(false);

  const primaryColumns = useMemo(
    () => columns.filter((col) => col.primaryKey),
    [columns],
  );

  const selectedRecords = useMemo(() => {
    return Array.from(selectedRows).map((index) => {
      const row = data[index];
      const condition: Record<string, unknown> = {};
      primaryColumns.forEach((col) => {
        condition[col.name] = row[col.name];
      });
      return condition;
    });
  }, [selectedRows, data, primaryColumns]);

  useEffect(() => {
    setData(initialData);
    setPage(1);
    setHasMore(initialData.length < initialTotal);
    setSelectedRows(new Set());
  }, [initialData, initialTotal, currentWhere]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoading(true);
    try {
      const { data: newData, error } = await getData(
        tableName,
        nextPage,
        30,
        currentSort,
        currentOrder,
        currentWhere,
      );

      if (error) {
        toast.error(error);
      } else {
        setData((prev) => [...prev, ...(newData as DataRow[])]);
        setPage(nextPage);
        if (newData.length < 30) {
          setHasMore(false);
        }
      }
    } catch {
      toast.error("Error al cargar más datos");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.keys()));
    }
  };

  const toggleSelectRow = (index: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleDelete = async () => {
    if (selectedRecords.length === 0) return;

    setDeleting(true);
    try {
      const { success, error } = await deleteRecords(
        tableName,
        selectedRecords,
      );

      if (success) {
        toast.success(
          `${selectedRecords.length} registro(s) eliminado(s) correctamente`,
        );
        setData((prev) => prev.filter((_, index) => !selectedRows.has(index)));
        setSelectedRows(new Set());
      } else {
        toast.error(error || "Error al eliminar los registros");
      }
    } catch {
      toast.error("Error al eliminar los registros");
    } finally {
      setDeleting(false);
    }
  };

  const { openEdit } = useRecordModal();

  if (initialError) {
    return (
      <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        <div>
          <p className="font-bold">Error</p>
          <p className="text-sm">{initialError}</p>
        </div>
      </div>
    );
  }

  return (
    <RelationModalProvider>
      <div className="flex-1 min-h-0 max-h-fit p-6">
        <ScrollArea className="h-full w-full">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-20 shadow-sm">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      data.length > 0 && selectedRows.size === data.length
                    }
                    onCheckedChange={toggleSelectAll}
                    aria-label="Seleccionar todo"
                  />
                </TableHead>
                <TableHead className="w-[80px]">Acciones</TableHead>
                {columns.map((col) => (
                  <SortableHeader
                    key={col.name}
                    column={col.name}
                    currentSort={currentSort}
                    currentOrder={currentOrder}
                    className="whitespace-nowrap py-3 bg-background"
                  >
                    <div className="flex items-center gap-2">
                      <TypeIconColumn column={col} className="size-3.5" />
                      <span>{col.name}</span>
                    </div>
                  </SortableHeader>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((row, i) => (
                  <TableRow
                    key={i}
                    data-state={selectedRows.has(i) && "selected"}
                    className="group even:bg-muted/10 hover:bg-primary/8 transition-colors border-b border-border/50 data-[state=selected]:bg-primary/8"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.has(i)}
                        onCheckedChange={() => toggleSelectRow(i)}
                        aria-label={`Seleccionar fila ${i + 1}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(row);
                        }}
                        title="Editar registro"
                      >
                        <Edit className="size-4" />
                      </Button>
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell
                        key={col.name}
                        className="whitespace-nowrap max-w-[350px] truncate py-4"
                      >
                        <Cell column={col} value={row[col.name]} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 2}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {hasMore && (
            <div className="flex justify-center py-4">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
                className="w-full max-w-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  "Cargar más"
                )}
              </Button>
            </div>
          )}

          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <RelatedRecordModal />

        {selectedRows.size > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background border shadow-lg rounded-full px-4 py-2 flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
            <span className="text-sm font-medium border-r pr-4">
              {selectedRows.size} seleccionados
            </span>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                  >
                    <Trash2 className="size-4" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción eliminará {selectedRows.size} registro(s)
                      permanentemente. Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleting}>
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete();
                      }}
                      disabled={deleting}
                      className="text-white bg-destructive  hover:bg-destructive/90"
                    >
                      {deleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        "Eliminar"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {selectedRows.size === 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => {
                    const rowIndex = Array.from(selectedRows)[0];
                    openEdit(data[rowIndex]);
                  }}
                >
                  <Edit className="size-4" />
                  Editar
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setSelectedRows(new Set())}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </RelationModalProvider>
  );
}
