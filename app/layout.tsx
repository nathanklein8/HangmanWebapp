import type { Metadata } from "next";
import localFont from 'next/font/local'
import "../styles/globals.css";

import { cn } from "@/lib/utils"
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = localFont({
  src: "../styles/fonts/inter.woff2",
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Hangman"
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get('theme')
  const theme = themeCookie ? themeCookie.value : "dark";
  return (
    <html lang="en" className={theme} style={{ colorScheme: theme }}>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider attribute="class" storageKey="theme" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
