import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-200/60 via-transparent to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-teal-700">
          Изучение языков
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-teal-950 sm:text-5xl sm:leading-tight">
          Говорите на новом языке уверенно
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-teal-900/70">
          Короткие уроки, умное повторение и практика каждый день. Выберите
          язык и начните путь от «привет» до живого диалога.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/languages"
            className="w-full rounded-full bg-teal-600 px-8 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-teal-600/25 transition hover:bg-teal-700 sm:w-auto"
          >
            Выбрать язык
          </Link>
          <Link
            href="/lessons"
            className="w-full rounded-full border border-teal-900/15 bg-white px-8 py-3.5 text-center text-sm font-semibold text-teal-950 transition hover:border-teal-600/40 hover:bg-teal-50 sm:w-auto"
          >
            Первый урок бесплатно
          </Link>
        </div>
      </div>
    </section>
  );
}
