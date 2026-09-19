import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-teal-900/10 bg-teal-950 text-teal-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:justify-between">
        <div>
          <p className="text-lg font-bold text-white">{SITE_NAME}</p>
          <p className="mt-2 max-w-xs text-sm text-teal-200/80">
            Учите иностранные языки в удобном темпе — от первых слов до
            свободного общения.
          </p>
        </div>
        <nav className="flex flex-col gap-2" aria-label="Подвал">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-teal-200/90 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-teal-800/50 px-4 py-4 text-center text-xs text-teal-300/70 sm:px-6">
        © {year} {SITE_NAME}
      </div>
    </footer>
  );
}
