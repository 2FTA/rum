import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "О проекте",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-teal-950">О проекте</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-teal-900/70">
        {SITE_NAME} — платформа для изучения иностранных языков. Мы помогаем
        учиться регулярно, запоминать надолго и видеть свой прогресс.
      </p>
    </div>
  );
}
