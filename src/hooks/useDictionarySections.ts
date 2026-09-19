"use client";

import { useCallback, useEffect, useState } from "react";
import type { DictionarySection } from "@/types/dictionary";
import {
  DICTIONARY_SECTIONS_KEY,
  createStorageId,
  ensureDictionarySections,
  readDictionarySections,
  removeDictionaryWordsBySectionId,
  writeDictionarySections,
} from "@/lib/storage";

export function useDictionarySections() {
  const [sections, setSectionsState] = useState<DictionarySection[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setSectionsState(ensureDictionarySections());
    setIsReady(true);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== DICTIONARY_SECTIONS_KEY) {
        return;
      }
      setSectionsState(readDictionarySections());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setSections = useCallback(
    (
      updater:
        | DictionarySection[]
        | ((prev: DictionarySection[]) => DictionarySection[]),
    ) => {
      setSectionsState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        writeDictionarySections(next);
        return next;
      });
    },
    [],
  );

  const addSection = useCallback(
    (title: string, emoji?: string) => {
      const trimmed = title.trim();
      if (!trimmed) {
        return false;
      }
      const section: DictionarySection = {
        id: createStorageId(),
        title: trimmed,
        emoji: emoji?.trim() || undefined,
        createdAt: Date.now(),
      };
      setSections((prev) =>
        [...prev, section].sort((a, b) => a.createdAt - b.createdAt),
      );
      return true;
    },
    [setSections],
  );

  const removeSection = useCallback(
    (id: string) => {
      setSections((prev) => prev.filter((section) => section.id !== id));
      removeDictionaryWordsBySectionId(id);
    },
    [setSections],
  );

  const updateSection = useCallback(
    (
      id: string,
      patch: Partial<Pick<DictionarySection, "title" | "emoji">>,
    ) => {
      setSections((prev) =>
        prev.map((section) => {
          if (section.id !== id) {
            return section;
          }
          const title =
            patch.title !== undefined ? patch.title.trim() : section.title;
          if (!title) {
            return section;
          }
          const emoji =
            patch.emoji !== undefined
              ? patch.emoji.trim() || undefined
              : section.emoji;
          return { ...section, title, emoji };
        }),
      );
    },
    [setSections],
  );

  return {
    sections,
    isReady,
    setSections,
    addSection,
    removeSection,
    updateSection,
  };
}
