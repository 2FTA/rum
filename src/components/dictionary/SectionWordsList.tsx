"use client";

import { useState } from "react";
import type { DictionaryWord, WordFormValues } from "@/types/dictionary";
import { AddWordRow } from "@/components/dictionary/AddWordRow";
import { WordListItem } from "@/components/dictionary/WordListItem";

type SectionWordsListProps = {
  words: DictionaryWord[];
  isReady: boolean;
  error: string | null;
  addWord: (values: WordFormValues) => Promise<boolean>;
  updateWord: (id: string, values: WordFormValues) => Promise<boolean>;
  removeWord: (id: string) => Promise<void>;
};

export function SectionWordsList({
  words,
  isReady,
  error,
  addWord,
  updateWord,
  removeWord,
}: SectionWordsListProps) {
  const [isAdding, setIsAdding] = useState(false);

  if (!isReady) {
    return (
      <p className="mt-6 text-sm text-notion-muted">Загрузка...</p>
    );
  }

  return (
    <div className="mt-6">
      {error ? (
        <p className="mb-4 rounded-notion border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {!isAdding ? (
        <button
          type="button"
          className="rounded-notion px-1 py-1 text-sm text-notion-muted transition-colors hover:bg-notion-hover hover:text-notion-text"
          onClick={() => setIsAdding(true)}
        >
          + Добавить слово
        </button>
      ) : null}

      {isAdding ? (
        <ul className="mt-2 flex flex-col">
          <AddWordRow
            onSave={addWord}
            onCancel={() => setIsAdding(false)}
          />
        </ul>
      ) : null}

      <ul className={`flex flex-col ${isAdding ? "mt-2" : "mt-2"}`}>
        {words.map((word) => (
          <WordListItem
            key={word.id}
            word={word}
            onUpdate={updateWord}
            onRemove={removeWord}
          />
        ))}
      </ul>
    </div>
  );
}
