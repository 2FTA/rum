"use client";

import { useCallback, useEffect, useState } from "react";
import type { DictionaryWord } from "@/types/dictionary";
import {
  createWord,
  deleteWord,
  fetchWordsBySectionId,
  updateWord as updateWordInDb,
} from "@/lib/data";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Не удалось выполнить операцию. Попробуйте ещё раз.";
}

export function useDictionaryWords(sectionId: string) {
  const [words, setWordsState] = useState<DictionaryWord[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadWords = useCallback(async () => {
    if (!sectionId) {
      return;
    }
    setIsReady(false);
    setError(null);
    try {
      const data = await fetchWordsBySectionId(sectionId);
      setWordsState(data);
    } catch (err) {
      setError(getErrorMessage(err));
      setWordsState([]);
    } finally {
      setIsReady(true);
    }
  }, [sectionId]);

  useEffect(() => {
    void loadWords();
  }, [loadWords]);

  const addWord = useCallback(
    async (term: string, translation: string) => {
      const trimmedTerm = term.trim();
      if (!trimmedTerm) {
        return false;
      }
      setError(null);
      try {
        const word = await createWord(sectionId, trimmedTerm, translation);
        setWordsState((prev) => [...prev, word]);
        return true;
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      }
    },
    [sectionId],
  );

  const updateWord = useCallback(
    async (id: string, term: string, translation: string) => {
      const trimmedTerm = term.trim();
      if (!trimmedTerm) {
        return false;
      }
      setError(null);
      try {
        const updated = await updateWordInDb(id, trimmedTerm, translation);
        setWordsState((prev) =>
          prev.map((word) => (word.id === id ? updated : word)),
        );
        return true;
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      }
    },
    [],
  );

  const removeWord = useCallback(async (id: string) => {
    setError(null);
    try {
      await deleteWord(id);
      setWordsState((prev) => prev.filter((word) => word.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }, []);

  return {
    words,
    isReady,
    error,
    reload: loadWords,
    addWord,
    updateWord,
    removeWord,
  };
}
