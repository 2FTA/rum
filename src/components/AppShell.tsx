"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { MobileHeader } from "@/components/MobileHeader";
import { Sidebar } from "@/components/Sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const toggleMobile = useCallback(
    () => setMobileOpen((open) => !open),
    [],
  );

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobile]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-notion-bg">
      <MobileHeader menuOpen={mobileOpen} onMenuToggle={toggleMobile} />

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          aria-label="Закрыть меню"
          onClick={closeMobile}
        />
      ) : null}

      <Sidebar mobileOpen={mobileOpen} onClose={closeMobile} />

      <div className="md:pl-[240px]">
        <main className="min-h-screen pt-11 md:pt-0">
          <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6 md:px-12 md:py-14 lg:px-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
