"use client";

import { useEffect, useState } from "react";
import type { DictionarySection } from "@/types/dictionary";
import type { FlashcardDirection } from "@/components/learning/FlashcardSession";
import { fetchSectionsByTitle } from "@/lib/data";

type TopicSelectModalProps = {
  open: boolean;
  onClose: () => void;
  onStart: (
    sectionIds: string[],
    direction: FlashcardDirection,
  ) => Promise<{ ok: true } | { ok: false; message: string }>;
};

export function TopicSelectModal({
  open,
  onClose,
  onStart,
}: TopicSelectModalProps) {
  const [sections, setSections] = useState<DictionarySection[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [direction, setDirection] = useState<FlashcardDirection>("ro-ru");
  const [isLoading, setIsLoading] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setSelectedIds(new Set());
    setDirection("ro-ru");
    setEmptyMessage(null);
    setIsLoading(true);
    setError(null);
    void (async () => {
      try {
        const data = await fetchSectionsByTitle();
        setSections(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Не удалось загрузить разделы.",
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const toggleSection = (id: string) => {
    setEmptyMessage(null);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const canStart = selectedIds.size > 0 && !isStarting;

  const handleStart = async () => {
    if (!canStart) {
      return;
    }
    setIsStarting(true);
    setEmptyMessage(null);
    setError(null);
    const result = await onStart([...selectedIds], direction);
    setIsStarting(false);
    if (result.ok) {
      onClose();
      return;
    }
    setEmptyMessage(result.message);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="topic-modal-title"
        className="relative z-10 max-h-[85vh] w-full max-w-md overflow-hidden rounded-lg bg-notion-bg shadow-lg"
      >
        <div className="border-b border-notion-border px-4 py-3">
          <h2
            id="topic-modal-title"
            className="text-lg font-medium text-notion-text"
          >
            Выберите темы
          </h2>
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-2 py-2">
          {isLoading ? (
            <p className="px-2 py-3 text-sm text-notion-muted">Загрузка...</p>
          ) : error ? (
            <p className="px-2 py-3 text-sm text-red-600">{error}</p>
          ) : sections.length === 0 ? (
            <p className="px-2 py-3 text-sm text-notion-muted">
              Нет доступных разделов.
            </p>
          ) : (
            <ul className="flex flex-col">
              {sections.map((section) => {
                const checked = selectedIds.has(section.id);
                return (
                  <li key={section.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-notion px-2 py-2 transition-colors hover:bg-notion-hover">
                      <input
                        type="checkbox"
                        checked={checked}
                        className="h-4 w-4 rounded border-notion-border"
                        onChange={() => toggleSection(section.id)}
                      />
                      <span className="text-lg leading-none" aria-hidden>
                        {section.emoji ?? "📄"}
                      </span>
                      <span className="text-sm text-notion-text">
                        {section.title}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-3 px-2 pb-2">
            <p className="mb-2 text-xs text-notion-muted">Направление перевода</p>
            <div className="flex rounded-notion bg-notion-sidebar p-0.5">
              <button
                type="button"
                className={[
                  "flex-1 rounded-notion px-2 py-1.5 text-xs transition-colors sm:text-sm",
                  direction === "ro-ru"
                    ? "border border-notion-border bg-notion-bg text-notion-text shadow-sm"
                    : "text-notion-muted hover:text-notion-text",
                ].join(" ")}
                onClick={() => setDirection("ro-ru")}
              >
                С румынского
              </button>
              <button
                type="button"
                className={[
                  "flex-1 rounded-notion px-2 py-1.5 text-xs transition-colors sm:text-sm",
                  direction === "ru-ro"
                    ? "border border-notion-border bg-notion-bg text-notion-text shadow-sm"
                    : "text-notion-muted hover:text-notion-text",
                ].join(" ")}
                onClick={() => setDirection("ru-ro")}
              >
                С русского
              </button>
            </div>
          </div>

          {emptyMessage ? (
            <p className="mx-2 mt-2 rounded-notion border border-notion-border bg-notion-sidebar px-3 py-2 text-sm text-notion-muted">
              {emptyMessage}
            </p>
          ) : null}
        </div>

        <div className="flex justify-end gap-2 border-t border-notion-border px-4 py-3">
          <button
            type="button"
            className="rounded-notion px-3 py-1.5 text-sm text-notion-muted transition-colors hover:bg-notion-hover"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            type="button"
            disabled={!canStart}
            className="rounded-notion px-3 py-1.5 text-sm text-notion-text transition-colors hover:bg-notion-hover disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => {
              void handleStart();
            }}
          >
            {isStarting ? "Загрузка..." : "Начать"}
          </button>
        </div>
      </div>
    </div>
  );
}
