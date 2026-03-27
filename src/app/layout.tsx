import { Toaster } from "@/shared/presentation/components/ui/sonner";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSans3.variable} antialiased overflow-hidden w-screen h-screen`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
