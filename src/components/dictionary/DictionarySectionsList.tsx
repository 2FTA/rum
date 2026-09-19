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
  const { sections, isReady, addSection, removeSection } =
    useDictionarySections();
  const [isAdding, setIsAdding] = useState(false);

  if (!isReady) {
    return (
      <div className="mt-8 space-y-1">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-9 animate-pulse rounded-notion bg-notion-hover/70"
          />
        ))}
      </div>
    );
  }

  const isEmpty = sections.length === 0 && !isAdding;

  return (
    <div className="mt-6">
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
                  onConfirm={() => removeSection(section.id)}
                />
              </Link>
            </li>
          ))}

          {isAdding ? (
            <li>
              <NewSectionInlineForm
                onSave={(title, emoji) => {
                  const saved = addSection(title, emoji);
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
