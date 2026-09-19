"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { SpeakButton } from "@/components/SpeakButton";
import { searchWords, type WordSearchResult } from "@/lib/data";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.15" />
      <path
        d="m10.5 10.5 3 3"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WordSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const data = await searchWords(trimmed);
          setResults(data);
          setIsOpen(true);
          setError(null);
        } catch (err) {
          setResults([]);
          setIsOpen(true);
          setError(
            err instanceof Error
              ? err.message
              : "Не удалось выполнить поиск.",
          );
        } finally {
          setIsLoading(false);
        }
      })();
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        close();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div
      ref={rootRef}
      className="fixed right-3 top-12 z-[60] w-[min(100vw-1.5rem,280px)] md:right-6 md:top-4"
    >
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-notion-muted" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (query.trim()) {
              setIsOpen(true);
            }
          }}
          placeholder="Поиск слов…"
          aria-label="Поиск слов"
          className="h-9 w-full rounded-notion border border-transparent bg-notion-sidebar py-1.5 pl-8 pr-3 text-sm text-notion-text outline-none transition-colors placeholder:text-notion-muted focus:border-notion-border"
        />
      </div>

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] overflow-hidden rounded-notion border border-notion-border bg-notion-bg shadow-sm">
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-notion-muted">Загрузка...</p>
          ) : error ? (
            <p className="px-3 py-2 text-sm text-red-600">{error}</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-notion-muted">Ничего не найдено</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/dictionary/section?id=${item.sectionId}`}
                    className="group flex items-start gap-2 px-3 py-2 transition-colors hover:bg-notion-hover"
                    onClick={() => {
                      setQuery("");
                      close();
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-notion-text">
                        {item.term}
                        <span className="text-notion-muted">
                          {" "}
                          — {item.translation || "—"}
                        </span>
                      </p>
                      <p className="mt-0.5 truncate text-xs text-notion-muted">
                        {item.sectionEmoji ?? "📄"} {item.sectionTitle}
                      </p>
                    </div>
                    <SpeakButton
                      term={item.term}
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
