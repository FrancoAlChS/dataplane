"use client";

import { clearCredentials } from "@/modules/database/infrastructure/sa/database.sa";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/presentation/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SidebarSession() {
  const router = useRouter();

  const handleLogout = async () => {
    await clearCredentials();
    router.push("/login"); // Setup page is served at /login currently
    router.refresh();
  };

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar sesión">
            <LogOut />
            <span>Cerrar sesión</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
