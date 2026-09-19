"use client";

import Link from "next/link";
import { DictionaryNotFound } from "@/components/dictionary/DictionaryNotFound";
import { SectionEditableHeader } from "@/components/dictionary/SectionEditableHeader";
import { SectionWordsList } from "@/components/dictionary/SectionWordsList";
import { useDictionarySections } from "@/hooks/useDictionarySections";
import { useDictionaryWords } from "@/hooks/useDictionaryWords";

type DictionarySectionViewProps = {
  sectionId: string;
};

export function DictionarySectionView({ sectionId }: DictionarySectionViewProps) {
  const { sections, isReady, error: sectionsError, updateSection } =
    useDictionarySections();
  const {
    words,
    isReady: wordsReady,
    error: wordsError,
    addWord,
    updateWord,
    removeWord,
  } = useDictionaryWords(sectionId);
  const section = sections.find((item) => item.id === sectionId);

  if (!isReady) {
    return <p className="text-sm text-notion-muted">Загрузка...</p>;
  }

  if (sectionsError && !section) {
    return (
      <p className="rounded-notion border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {sectionsError}
      </p>
    );
  }

  if (!section) {
    return <DictionaryNotFound />;
  }

  return (
    <article>
      <Link
        href="/dictionary"
        className="inline-block rounded-notion px-1 py-0.5 text-sm text-notion-muted transition-colors hover:bg-notion-hover hover:text-notion-text"
      >
        ← Назад к словарю
      </Link>

      {sectionsError ? (
        <p className="mt-4 rounded-notion border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {sectionsError}
        </p>
      ) : null}

      <SectionEditableHeader
        section={section}
        onSave={(patch) => {
          void updateSection(sectionId, patch);
        }}
      />

      <p className="mt-2 px-1 text-sm text-notion-muted">
        Слов: {wordsReady ? words.length : "…"}
      </p>

      <SectionWordsList
        words={words}
        isReady={wordsReady}
        error={wordsError}
        addWord={addWord}
        updateWord={updateWord}
        removeWord={removeWord}
      />
    </article>
  );
}
