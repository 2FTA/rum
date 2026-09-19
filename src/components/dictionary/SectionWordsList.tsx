"use client";

import { useState } from "react";
import type { DictionaryWord } from "@/types/dictionary";
import { AddWordRow } from "@/components/dictionary/AddWordRow";
import { WordListItem } from "@/components/dictionary/WordListItem";

type SectionWordsListProps = {
  words: DictionaryWord[];
  isReady: boolean;
  addWord: (term: string, translation: string) => boolean;
  updateWord: (id: string, term: string, translation: string) => boolean;
  removeWord: (id: string) => void;
};

export function SectionWordsList({
  words,
  isReady,
  addWord,
  updateWord,
  removeWord,
}: SectionWordsListProps) {
  const [isAdding, setIsAdding] = useState(false);

  if (!isReady) {
    return (
      <div className="mt-8 space-y-1">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-10 animate-pulse rounded-notion bg-notion-hover/70"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <ul className="flex flex-col">
        {words.map((word) => (
          <WordListItem
            key={word.id}
            word={word}
            onUpdate={updateWord}
            onRemove={removeWord}
          />
        ))}
        {isAdding ? (
          <AddWordRow
            onSave={addWord}
            onCancel={() => setIsAdding(false)}
          />
        ) : null}
      </ul>

      {!isAdding ? (
        <button
          type="button"
          className="mt-2 rounded-notion px-1 py-1 text-sm text-notion-muted transition-colors hover:bg-notion-hover hover:text-notion-text"
          onClick={() => setIsAdding(true)}
        >
          + Добавить слово
        </button>
      ) : null}
    </div>
  );
}
