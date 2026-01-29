import { AppSidebar } from "@/shared/presentation/components/AppSidebar";
import { SidebarProvider } from "@/shared/presentation/components/ui/sidebar";
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
          <main className="flex-1 overflow-hidden h-screen flex flex-col">
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
