import { getTableColumns, getTableData } from "@/service/tables.service";
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
        defaultValue="properties"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="properties">Propiedades</TabsTrigger>
          <TabsTrigger value="data">Datos</TabsTrigger>
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
                    {columns.map((col: any) => (
                      <TableRow key={col.column_name}>
                        <TableCell className="font-medium">
                          {col.column_name}
                        </TableCell>
                        <TableCell>{col.data_type}</TableCell>
                        <TableCell>{col.is_nullable}</TableCell>
                        <TableCell className="text-muted-foreground italic">
                          {col.column_default || "NULL"}
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
                        {columns.map((col: any) => (
                          <TableHead key={col.column_name}>
                            {col.column_name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((row: any, idx: number) => (
                        <TableRow key={idx}>
                          {columns.map((col: any) => (
                            <TableCell key={`${idx}-${col.column_name}`}>
                              {row[col.column_name]?.toString() || "NULL"}
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
