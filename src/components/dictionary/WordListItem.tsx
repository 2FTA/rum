"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { DictionaryWord } from "@/types/dictionary";
import {
  wordToFormValues,
  type WordFormValues,
} from "@/types/dictionary";
import { DeleteWordControl } from "@/components/dictionary/DeleteWordControl";
import { WordFieldColumns } from "@/components/dictionary/WordFieldColumns";
import { WordFormFields } from "@/components/dictionary/WordFormFields";
import { WordMetaDisplay } from "@/components/dictionary/WordMetaDisplay";
import { SpeakButton } from "@/components/SpeakButton";
import { PencilIcon } from "@/components/icons/PencilIcon";

type WordListItemProps = {
  word: DictionaryWord;
  onUpdate: (id: string, values: WordFormValues) => Promise<boolean>;
  onRemove: (id: string) => Promise<void>;
};

const actionButtonClassName =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-notion text-notion-muted opacity-100 transition-opacity hover:bg-notion-hover hover:text-notion-text md:opacity-0 md:group-hover:opacity-100";

export function WordListItem({ word, onUpdate, onRemove }: WordListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState<WordFormValues>(wordToFormValues(word));
  const rootRef = useRef<HTMLLIElement>(null);
  const termRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setValues(wordToFormValues(word));
    }
  }, [word, isEditing]);

  useEffect(() => {
    if (isEditing) {
      termRef.current?.focus();
    }
  }, [isEditing]);

  const save = useCallback(async () => {
    const saved = await onUpdate(word.id, values);
    if (saved) {
      setIsEditing(false);
    }
  }, [onUpdate, values, word.id]);

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
    setValues(wordToFormValues(word));
    setIsEditing(false);
  };

  const handleEnter = (
    event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
      <div className="group rounded-notion px-2 py-2 transition-colors hover:bg-notion-hover">
        {isEditing ? (
          <WordFormFields
            values={values}
            onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
            onKeyDown={handleEnter}
            termInputRef={termRef}
          />
        ) : (
          <div className="flex items-start gap-1 md:items-center">
            <div className="min-w-0 flex-1">
              <WordFieldColumns term={word.term} translation={word.translation} />
              <WordMetaDisplay word={word} />
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
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
              <SpeakButton
                term={word.term}
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100"
              />
              <DeleteWordControl
                term={word.term}
                onConfirm={() => {
                  void onRemove(word.id);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </li>
  );
}
