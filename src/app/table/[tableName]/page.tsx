/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/presentation/components/ui/card";
import { ScrollArea } from "@/shared/presentation/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/presentation/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/presentation/components/ui/tabs";
import {
  getTableColumns,
  getTableData,
} from "@/shared/presentation/server-actions/database.sa";

export default async function TablePage({
  params,
}: {
  params: Promise<{ tableName: string }>;
}) {
  const { tableName } = await params;
  const columns = await getTableColumns(tableName);
  const data = await getTableData(tableName);

  return (
    <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Tabla: {tableName}
        </h1>
      </div>

      <Tabs
        defaultValue="data"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="data">Datos</TabsTrigger>
          <TabsTrigger value="properties">Propiedades</TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 overflow-hidden mt-4">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Estructura de la tabla</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full px-6 pb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Nulo</TableHead>
                      <TableHead>Default</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {columns.map((col) => (
                      <TableRow key={col.name}>
                        <TableCell className="font-medium">
                          {col.name}
                        </TableCell>
                        <TableCell>{col.type}</TableCell>
                        <TableCell>{col.nullable ? "true" : "false"}</TableCell>
                        <TableCell className="text-muted-foreground italic">
                          {col.defaultValue || "NULL"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="flex-1 overflow-hidden mt-4">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Registros (Límite 30)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full px-6 pb-6">
                {data.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columns.map((col) => (
                          <TableHead key={col.name}>{col.name}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row: any, idx: number) => (
                        <TableRow key={idx}>
                          {columns.map((col) => (
                            <TableCell key={`${idx}-${col.name}`}>
                              {row[col.name]?.toString() || "NULL"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex h-[200px] items-center justify-center text-muted-foreground italic">
                    No hay datos disponibles en esta tabla.
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
