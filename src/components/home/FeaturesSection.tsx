import { FEATURES } from "@/lib/constants";

export function FeaturesSection() {
  return (
    <section className="border-t border-teal-900/10 bg-white px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-teal-950">
            Всё для эффективного обучения
          </h2>
          <p className="mt-4 text-teal-900/70">
            Платформа объединяет проверенные методики и современный интерфейс.
          </p>
        </div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ title, description, icon }) => (
            <li
              key={title}
              className="rounded-2xl border border-teal-900/10 bg-teal-50/50 p-6 transition hover:border-teal-600/30 hover:shadow-md"
            >
              <span className="text-3xl" role="img" aria-hidden>
                {icon}
              </span>
              <h3 className="mt-4 font-semibold text-teal-950">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-teal-900/65">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
