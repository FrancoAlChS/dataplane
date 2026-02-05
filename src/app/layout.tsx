import { AppSidebar } from "@/shared/presentation/components/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/presentation/components/ui/sidebar";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overflow-hidden w-screen h-screen">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}
