import type { Metadata } from "next";
import localFont from 'next/font/local'
import "../globals.css";

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
 
const fontSans = localFont({
  src: "../public/fonts/inter.woff2",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Hangman"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable)}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
