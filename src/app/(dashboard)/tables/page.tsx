import { tableService } from "@/modules/tables/infrastructure/service/table.service";
import { Button } from "@/shared/presentation/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/presentation/components/ui/card";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
  TableProperties,
  Users
} from "lucide-react";

export default async function TablesPage() {
  const stats = await tableService.getDatabaseStats();

  const futureModules = [
    {
      title: "Exportar",
      description: "Exporta tus tablas a diferentes formatos.",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Analytics",
      description: "Visualiza métricas y tendencias en tiempo real.",
      icon: BarChart3,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Equipo",
      description: "Gestiona usuarios y permisos de acceso.",
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Configuración",
      description: "Ajustes globales de la plataforma y API.",
      icon: Settings,
      color: "text-slate-500",
      bgColor: "bg-slate-50",
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tablas Activas</CardTitle>
            <TableProperties className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tableCount}</div>
            <p className="text-xs text-muted-foreground">
              Tablas en el esquema público
            </p>
          </CardContent>
        </Card>
        {/* Placeholder cards for other stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registros Totales</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rowCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Aproximación de registros activos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold tracking-tight mb-4">Próximos Módulos</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {futureModules.map((module) => (
            <Card key={module.title} className="group relative overflow-hidden transition-all hover:shadow-md border-dashed">
              <CardHeader>
                <div className={`p-2 w-fit rounded-lg ${module.bgColor} ${module.color} mb-2`}>
                  <module.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground group-hover:text-primary" disabled>
                  Próximamente
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
