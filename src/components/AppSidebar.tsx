import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getTables } from "@/service/tables.service";
import { Database, Table } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export async function AppSidebar() {
  const tables = await getTables();

  return (
    <Sidebar collapsible="none" className="h-full">
      <SidebarHeader>
        <div className="flex shrink-0 size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
          <Database className="size-4" />
        </div>
      </SidebarHeader>
      <SidebarContent className="h-full">
        <SidebarGroup className="h-full">
          <SidebarGroupContent className="h-full">
            <ScrollArea className="max-h-[calc(100vh-70px)]">
              <SidebarMenu className="h-full">
                {tables.length > 0 ? (
                  tables.map((table) => (
                    <SidebarMenuItem key={table}>
                      <SidebarMenuButton asChild>
                        <a
                          href={`/table/${table}`}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-accent rounded-md group transition-colors"
                        >
                          <Table className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="text-sm font-medium">{table}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground italic bg-muted/30 rounded-md mx-2">
                    No tables found or error connecting.
                  </div>
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
