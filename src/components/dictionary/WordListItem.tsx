"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { DictionaryWord } from "@/types/dictionary";
import { DeleteWordControl } from "@/components/dictionary/DeleteWordControl";
import { WordFieldColumns } from "@/components/dictionary/WordFieldColumns";

type WordListItemProps = {
  word: DictionaryWord;
  onUpdate: (id: string, term: string, translation: string) => Promise<boolean>;
  onRemove: (id: string) => Promise<void>;
};

export function WordListItem({ word, onUpdate, onRemove }: WordListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [term, setTerm] = useState(word.term);
  const [translation, setTranslation] = useState(word.translation);
  const termRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setTerm(word.term);
      setTranslation(word.translation);
    }
  }, [word.term, word.translation, isEditing]);

  useEffect(() => {
    if (isEditing) {
      termRef.current?.focus();
    }
  }, [isEditing]);

  const save = async () => {
    const saved = await onUpdate(word.id, term, translation);
    if (saved) {
      setIsEditing(false);
    }
  };

  const cancel = () => {
    setTerm(word.term);
    setTranslation(word.translation);
    setIsEditing(false);
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void save();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };

  return (
    <li>
      <div
        role={isEditing ? undefined : "button"}
        tabIndex={isEditing ? undefined : 0}
        className="group flex items-start gap-2 rounded-notion px-2 py-2 transition-colors hover:bg-notion-hover md:items-center md:py-1.5"
        onClick={(event) => {
          if (isEditing) {
            return;
          }
          if ((event.target as HTMLElement).closest("button")) {
            return;
          }
          setIsEditing(true);
        }}
        onKeyDown={(event) => {
          if (isEditing) {
            return;
          }
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsEditing(true);
          }
        }}
      >
        <WordFieldColumns
          term={term}
          translation={translation}
          editable={isEditing}
          onTermChange={setTerm}
          onTranslationChange={setTranslation}
          onTermKeyDown={handleEnter}
          onTranslationKeyDown={handleEnter}
          termInputRef={termRef}
        />
        <DeleteWordControl
          term={word.term}
          onConfirm={() => {
            void onRemove(word.id);
          }}
        />
      </div>
    </li>
  );
}
