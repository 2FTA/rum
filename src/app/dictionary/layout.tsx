import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Словарь",
};

export default function DictionaryLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
