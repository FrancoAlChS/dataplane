"use client";

import { getRecordByValue } from "@/modules/tables/infrastructure/sa/tabla.sa";
import { Badge } from "@/shared/presentation/components/ui/badge";
import { Button } from "@/shared/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/presentation/components/ui/dialog";
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
import { ArrowUpRight, Loader2, TableProperties } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRelationModal } from "../../context/relation-modal.context";

export function RelatedRecordModal() {
  const { isOpen, targetTable, targetColumn, targetValue, closeModal } =
    useRelationModal();
  const router = useRouter();
  const [record, setRecord] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoToTable = () => {
    if (!targetTable || !targetColumn || !targetValue) return;

    const filter = `${targetColumn} = '${targetValue}'`;
    const params = new URLSearchParams();
    params.set("where", filter);

    closeModal();
    router.push(`/tables/${targetTable}?${params.toString()}`);
  };

  useEffect(() => {
    if (isOpen && targetTable && targetColumn && targetValue) {
      const fetchRecord = async () => {
        setLoading(true);
        try {
          const data = await getRecordByValue(
            targetTable,
            targetColumn,
            targetValue,
          );
          setRecord(data as Record<string, unknown>);
        } catch (error) {
          console.error("Error fetching related record:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchRecord();
    }
  }, [isOpen, targetTable, targetColumn, targetValue]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-sm ">
        <DialogHeader className="h-fit border-b pb-4">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-bold min-w-0 flex-1">
              {record && (
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 size-8"
                  onClick={handleGoToTable}
                  title="Ver en tabla"
                >
                  <ArrowUpRight className="size-4" />
                </Button>
              )}

              <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
                <span className="truncate font-semibold text-lg">
                  {targetTable}
                </span>
              </div>
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className=" min-h-0 flex flex-1 overflow-hidden mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <Loader2 className="animate-spin h-10 w-10 text-primary" />
              <p className="text-muted-foreground animate-pulse">
                Cargando datos del registro...
              </p>
            </div>
          ) : record ? (
            <ScrollArea className="flex-1 w-full rounded-md border">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[200px] bg-background">
                      Campo
                    </TableHead>
                    <TableHead className="bg-background">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(record).map(([key, val]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium align-top">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary uppercase tracking-wider">
                            {key}
                          </span>
                          {key === targetColumn && (
                            <Badge
                              variant="outline"
                              className="text-[8px] h-4 py-0 px-1 border-primary/30 text-primary/70"
                            >
                              Referencia
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="break-all">
                        {val !== null ? (
                          typeof val === "object" ? (
                            <pre className="text-xs overflow-auto max-h-40 whitespace-pre-wrap bg-secondary/30 p-2 rounded">
                              {JSON.stringify(val, null, 2)}
                            </pre>
                          ) : (
                            <span className="text-sm">{String(val)}</span>
                          )
                        ) : (
                          <span className="text-muted-foreground italic text-xs">
                            null
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-center gap-4">
              <div className="p-4 rounded-full bg-destructive/10 text-destructive">
                <TableProperties className="size-8 opacity-50" />
              </div>
              <p className="text-muted-foreground">
                No se encontró el registro relacionado en la tabla{" "}
                <span className="font-semibold text-foreground">
                  {targetTable}
                </span>
                .
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
