import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Уроки",
};

export default function LessonsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-teal-950">Уроки</h1>
      <p className="mt-4 text-teal-900/70">
        Раздел уроков в разработке — загляните позже.
      </p>
    </div>
  );
}
