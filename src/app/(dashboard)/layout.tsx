import { AppSidebar } from "@/shared/presentation/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/shared/presentation/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <main className="flex-1 overflow-hidden">{children}</main>
        {/* <StatusBar /> */}
      </SidebarInset>
    </SidebarProvider>
  );
}