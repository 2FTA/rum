"use client";

import { useCallback, useEffect, useState } from "react";
import type { DictionarySection } from "@/types/dictionary";
import {
  createSection,
  deleteSection,
  fetchSectionsWithDefaults,
  updateSection as updateSectionInDb,
} from "@/lib/data";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Не удалось выполнить операцию. Попробуйте ещё раз.";
}

export function useDictionarySections() {
  const [sections, setSectionsState] = useState<DictionarySection[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSections = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchSectionsWithDefaults();
      setSectionsState(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    void loadSections();
  }, [loadSections]);

  const addSection = useCallback(async (title: string, emoji?: string) => {
    const trimmed = title.trim();
    if (!trimmed) {
      return false;
    }
    setError(null);
    try {
      const section = await createSection(trimmed, emoji);
      setSectionsState((prev) =>
        [...prev, section].sort((a, b) => a.createdAt - b.createdAt),
      );
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  }, []);

  const removeSection = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteSection(id);
      setSectionsState((prev) => prev.filter((section) => section.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  const updateSection = useCallback(
    async (
      id: string,
      patch: Partial<Pick<DictionarySection, "title" | "emoji">>,
    ) => {
      setError(null);
      try {
        const updated = await updateSectionInDb(id, {
          title: patch.title,
          emoji: patch.emoji,
        });
        setSectionsState((prev) =>
          prev.map((section) => (section.id === id ? updated : section)),
        );
      } catch (err) {
        setError(getErrorMessage(err));
      }
    },
    [],
  );

  return {
    sections,
    isReady,
    error,
    reload: loadSections,
    addSection,
    removeSection,
    updateSection,
  };
}
