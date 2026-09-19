"use client";

import { SITE_NAME } from "@/lib/constants";

type MobileHeaderProps = {
  onMenuToggle: () => void;
  menuOpen: boolean;
};

export function MobileHeader({ onMenuToggle, menuOpen }: MobileHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-11 items-center gap-2 border-b border-notion-border bg-notion-sidebar px-3 md:hidden">
      <button
        type="button"
        onClick={onMenuToggle}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-notion text-notion-text transition-colors hover:bg-notion-hover"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M3 4.5h12M3 9h12M3 13.5h12"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <span className="truncate text-sm font-medium text-notion-text">
        {SITE_NAME}
      </span>
    </header>
  );
}
