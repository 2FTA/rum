"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { DictionaryWord } from "@/types/dictionary";
import { DeleteWordControl } from "@/components/dictionary/DeleteWordControl";
import { WordFieldColumns } from "@/components/dictionary/WordFieldColumns";
import { SpeakButton } from "@/components/SpeakButton";
import { PencilIcon } from "@/components/icons/PencilIcon";

type WordListItemProps = {
  word: DictionaryWord;
  onUpdate: (id: string, term: string, translation: string) => Promise<boolean>;
  onRemove: (id: string) => Promise<void>;
};

const actionButtonClassName =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-notion text-notion-muted opacity-100 transition-opacity hover:bg-notion-hover hover:text-notion-text md:opacity-0 md:group-hover:opacity-100";

export function WordListItem({ word, onUpdate, onRemove }: WordListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [term, setTerm] = useState(word.term);
  const [translation, setTranslation] = useState(word.translation);
  const rootRef = useRef<HTMLLIElement>(null);
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

  const save = useCallback(async () => {
    const saved = await onUpdate(word.id, term, translation);
    if (saved) {
      setIsEditing(false);
    }
  }, [onUpdate, term, translation, word.id]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        void save();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isEditing, save]);

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
    <li ref={rootRef}>
      <div className="group flex items-start gap-1 rounded-notion px-2 py-2 transition-colors hover:bg-notion-hover md:items-center md:py-1.5">
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
        <div className="flex shrink-0 items-center gap-0.5">
          {!isEditing ? (
            <>
              <button
                type="button"
                aria-label={`Редактировать «${word.term}»`}
                className={actionButtonClassName}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <PencilIcon className="h-3.5 w-3.5" />
              </button>
              <SpeakButton term={word.term} className="opacity-100 md:opacity-0 md:group-hover:opacity-100" />
              <DeleteWordControl
                term={word.term}
                onConfirm={() => {
                  void onRemove(word.id);
                }}
              />
            </>
          ) : null}
        </div>
      </div>
    </li>
  );
}
