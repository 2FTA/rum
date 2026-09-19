"use client";

import { useState } from "react";
import { SectionListItem } from "@/components/dictionary/SectionListItem";
import { NewSectionInlineForm } from "@/components/dictionary/NewSectionInlineForm";
import { useDictionarySections } from "@/hooks/useDictionarySections";

export function DictionarySectionsList() {
  const { sections, isReady, error, addSection, removeSection, updateSection } =
    useDictionarySections();
  const [isAdding, setIsAdding] = useState(false);

  if (!isReady) {
    return (
      <p className="mt-8 text-sm text-notion-muted">Загрузка...</p>
    );
  }

  const isEmpty = sections.length === 0 && !isAdding;

  return (
    <div className="mt-6">
      {error ? (
        <p className="mb-4 rounded-notion border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className="rounded-notion px-1 py-1 text-sm text-notion-muted transition-colors hover:bg-notion-hover hover:text-notion-text"
        onClick={() => setIsAdding(true)}
      >
        + Новый раздел
      </button>

      {isEmpty && !isAdding ? (
        <p className="mt-6 text-sm text-notion-muted">
          Пока нет ни одного раздела. Добавьте первый.
        </p>
      ) : null}

      {!isEmpty || isAdding ? (
        <ul className="mt-2 flex flex-col">
          {sections.map((section) => (
            <SectionListItem
              key={section.id}
              section={section}
              onUpdate={async (id, patch) => {
                await updateSection(id, patch);
              }}
              onRemove={removeSection}
            />
          ))}

          {isAdding ? (
            <li>
              <NewSectionInlineForm
                onSave={async (title, emoji) => {
                  const saved = await addSection(title, emoji);
                  if (saved) {
                    setIsAdding(false);
                  }
                  return saved;
                }}
                onCancel={() => setIsAdding(false)}
              />
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
