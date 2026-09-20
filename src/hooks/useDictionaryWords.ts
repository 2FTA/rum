"use client";

import { useCallback, useEffect, useState } from "react";
import type { WordFormValues } from "@/types/dictionary";
import type { DictionaryWord } from "@/types/dictionary";
import {
  createWord,
  deleteWord,
  fetchWordsBySectionId,
  updateWord as updateWordInDb,
} from "@/lib/data";
import { isWordFormValid, wordFormToPayload } from "@/lib/word-form";

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
    async (values: WordFormValues) => {
      if (!isWordFormValid(values)) {
        return false;
      }
      setError(null);
      try {
        const word = await createWord(sectionId, wordFormToPayload(values));
        setWordsState((prev) => [word, ...prev]);
        return true;
      } catch (err) {
        setError(getErrorMessage(err));
        return false;
      }
    },
    [sectionId],
  );

  const updateWord = useCallback(async (id: string, values: WordFormValues) => {
    if (!isWordFormValid(values)) {
      return false;
    }
    setError(null);
    try {
      const updated = await updateWordInDb(id, wordFormToPayload(values));
      setWordsState((prev) =>
        prev.map((word) => (word.id === id ? updated : word)),
      );
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    }
  }, []);

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
