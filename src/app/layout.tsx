import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { SearchBar } from "@/components/SearchBar";
import { SITE_NAME } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Изучение румынского языка",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full font-sans text-notion-text">
        <SearchBar />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
