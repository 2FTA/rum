"use client";

import { useEffect, useState } from "react";
import type { DictionarySection } from "@/types/dictionary";
import { fetchSectionsByTitle } from "@/lib/data";

type TopicSelectModalProps = {
  open: boolean;
  onClose: () => void;
};

export function TopicSelectModal({ open, onClose }: TopicSelectModalProps) {
  const [sections, setSections] = useState<DictionarySection[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setSelectedIds(new Set());
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

  const canStart = selectedIds.size > 0;

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
            onClick={onClose}
          >
            Начать
          </button>
        </div>
      </div>
    </div>
  );
}
