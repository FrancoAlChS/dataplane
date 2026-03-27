import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/presentation/components/ui/collapsible";
import {
  ChevronRight,
  Database,
  Globe,
  Layout,
  Library,
  Plus,
  Settings,
  Table as TableIcon
} from "lucide-react";
import { SidebarSession } from "./sidebar/sidebar-session";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar";

interface SidebarItem {
  title: string;
  icon?: React.ElementType;
  url?: string;
  status?: "online" | "offline";
  items?: SidebarItem[];
}

interface SidebarGroup {
  title: string;
  icon: React.ElementType;
  isActive?: boolean;
  items: SidebarItem[];
}

const treeData: SidebarGroup[] = [
  {
    title: "Connections",
    icon: Globe,
    items: [
      { title: "Local PostgreSQL", status: "online" },
      { title: "Production DB", status: "offline" },
    ],
  },
  {
    title: "Databases",
    icon: Database,
    isActive: true,
    items: [
      {
        title: "ecommerce_db",
        items: [
          {
            title: "Schemas",
            icon: Library,
            items: [
              {
                title: "public",
                items: [
                  { title: "Tables", icon: TableIcon, url: "/tables" },
                  { title: "Views", icon: Layout },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className="h-12 border-b border-border flex items-center px-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground size-6 rounded flex items-center justify-center">
            <Database className="size-3.5" />
          </div>

        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground/50 px-4 mb-2">
            Explorer
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {treeData.map((group) => (
                <Collapsible key={group.title} defaultOpen={group.isActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={group.title}>
                        <group.icon className="size-4" />
                        <span>{group.title}</span>
                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.items.map((item: SidebarItem) => (
                          <SidebarMenuSubItem key={item.title}>
                            {item.items ? (
                              <Collapsible className="group/sub-collapsible">
                                <CollapsibleTrigger asChild>
                                  <SidebarMenuSubButton>
                                    {item.icon && <item.icon className="size-3.5" />}
                                    <span className="truncate">{item.title}</span>
                                    <ChevronRight className="ml-auto size-3 transition-transform duration-200 group-data-[state=open]/sub-collapsible:rotate-90" />
                                  </SidebarMenuSubButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <SidebarMenuSub className="ml-2 border-l border-border/50">
                                    {item.items.map((subItem: SidebarItem) => (
                                      <SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton asChild={!!subItem.url}>
                                          {subItem.url ? (
                                            <a href={subItem.url}>
                                              {subItem.icon && <subItem.icon className="size-3.5 text-muted-foreground" />}
                                              <span>{subItem.title}</span>
                                            </a>
                                          ) : (
                                            <>
                                              {subItem.icon && <subItem.icon className="size-3.5 text-muted-foreground" />}
                                              <span>{subItem.title}</span>
                                            </>
                                          )}
                                        </SidebarMenuSubButton>
                                      </SidebarMenuSubItem>
                                    ))}
                                  </SidebarMenuSub>
                                </CollapsibleContent>
                              </Collapsible>
                            ) : (
                              <SidebarMenuSubButton>
                                <span className="truncate">{item.title}</span>
                                {item.status && (
                                  <div className={`ml-auto size-1.5 rounded-full ${item.status === "online" ? "bg-emerald-500" : "bg-rose-500"}`} />
                                )}
                              </SidebarMenuSubButton>
                            )}
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm">
                <Settings className="size-4" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm">
                <Plus className="size-4" />
                <span>New Connection</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSession />
    </Sidebar>
  );
}
