"use client";

import Link from "next/link";
import { useState } from "react";
import { DeleteSectionControl } from "@/components/dictionary/DeleteSectionControl";
import { NewSectionInlineForm } from "@/components/dictionary/NewSectionInlineForm";
import { useDictionarySections } from "@/hooks/useDictionarySections";

function SectionEmoji({ emoji }: { emoji?: string }) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center text-[1.125rem] leading-none"
      aria-hidden
    >
      {emoji ?? "📄"}
    </span>
  );
}

export function DictionarySectionsList() {
  const { sections, isReady, error, addSection, removeSection } =
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
            <li key={section.id}>
              <Link
                href={`/dictionary/${section.id}`}
                className="group flex items-center gap-2 rounded-notion px-2 py-1.5 transition-colors hover:bg-notion-hover"
              >
                <SectionEmoji emoji={section.emoji} />
                <span className="min-w-0 flex-1 truncate text-sm text-notion-text">
                  {section.title}
                </span>
                <DeleteSectionControl
                  sectionTitle={section.title}
                  onConfirm={() => {
                    void removeSection(section.id);
                  }}
                />
              </Link>
            </li>
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
