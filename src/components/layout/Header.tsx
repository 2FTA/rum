import Link from "next/link";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-teal-900/10 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-teal-950"
        >
          {SITE_NAME}
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Основная">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-teal-900/70 transition-colors hover:text-teal-950"
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/languages"
          className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
        >
          Начать
        </Link>
      </div>
    </header>
  );
}
