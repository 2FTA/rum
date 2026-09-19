import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Языки",
};

export default function LanguagesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-teal-950">Языки</h1>
      <p className="mt-4 text-teal-900/70">
        Скоро здесь появится каталог языков для изучения.
      </p>
    </div>
  );
}
