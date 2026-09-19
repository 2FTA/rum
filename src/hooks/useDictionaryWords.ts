"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DictionaryWord } from "@/types/dictionary";
import {
  DICTIONARY_WORDS_KEY,
  createStorageId,
  readDictionaryWords,
  writeDictionaryWords,
} from "@/lib/storage";

export function useDictionaryWords(sectionId: string) {
  const [words, setWordsState] = useState<DictionaryWord[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setWordsState(readDictionaryWords());
    setIsReady(true);
  }, []);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== DICTIONARY_WORDS_KEY) {
        return;
      }
      setWordsState(readDictionaryWords());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setWords = useCallback(
    (
      updater:
        | DictionaryWord[]
        | ((prev: DictionaryWord[]) => DictionaryWord[]),
    ) => {
      setWordsState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        writeDictionaryWords(next);
        return next;
      });
    },
    [],
  );

  const sectionWords = useMemo(
    () =>
      words
        .filter((word) => word.sectionId === sectionId)
        .sort((a, b) => a.createdAt - b.createdAt),
    [words, sectionId],
  );

  const addWord = useCallback(
    (term: string, translation: string) => {
      const trimmedTerm = term.trim();
      if (!trimmedTerm) {
        return false;
      }
      const word: DictionaryWord = {
        id: createStorageId(),
        sectionId,
        term: trimmedTerm,
        translation: translation.trim(),
        createdAt: Date.now(),
      };
      setWords((prev) => [...prev, word]);
      return true;
    },
    [sectionId, setWords],
  );

  const updateWord = useCallback(
    (id: string, term: string, translation: string) => {
      const trimmedTerm = term.trim();
      if (!trimmedTerm) {
        return false;
      }
      setWords((prev) =>
        prev.map((word) =>
          word.id === id
            ? {
                ...word,
                term: trimmedTerm,
                translation: translation.trim(),
              }
            : word,
        ),
      );
      return true;
    },
    [setWords],
  );

  const removeWord = useCallback(
    (id: string) => {
      setWords((prev) => prev.filter((word) => word.id !== id));
    },
    [setWords],
  );

  return {
    words: sectionWords,
    isReady,
    addWord,
    updateWord,
    removeWord,
  };
}
