"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon } from "@/components/icons/BookIcon";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

function NavIcon({ label }: { label: string }) {
  if (label === "Словарь") {
    return <BookIcon className="shrink-0 text-notion-muted" />;
  }
  return null;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-notion-border bg-notion-sidebar transition-transform duration-200 ease-out md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Навигация"
      >
        <div className="px-3 pb-2 pt-3 md:px-4 md:pt-4">
          <Link
            href="/"
            onClick={onClose}
            className="block rounded-notion px-2 py-1.5 text-sm font-medium text-notion-text transition-colors hover:bg-notion-hover"
          >
            {SITE_NAME}
          </Link>
        </div>

        <nav className="flex flex-col gap-0.5 px-2 md:px-3">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={[
                  "flex items-center gap-2 rounded-notion px-2 py-1.5 text-sm text-notion-text transition-colors",
                  isActive
                    ? "bg-notion-hover"
                    : "hover:bg-notion-hover",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                <NavIcon label={label} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" aria-hidden />
      </aside>
    </>
  );
}
