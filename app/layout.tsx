import type { Metadata } from "next";
import localFont from 'next/font/local'
import "../styles/globals.css";

import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider";
 
const fontSans = localFont({
  src: "../styles/fonts/inter.woff2",
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
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
