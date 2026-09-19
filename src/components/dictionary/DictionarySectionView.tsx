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
  const { sections, isReady, updateSection } = useDictionarySections();
  const {
    words,
    isReady: wordsReady,
    addWord,
    updateWord,
    removeWord,
  } = useDictionaryWords(sectionId);
  const section = sections.find((item) => item.id === sectionId);

  if (!isReady) {
    return (
      <div className="space-y-4">
        <div className="h-4 w-32 animate-pulse rounded-notion bg-notion-hover/70" />
        <div className="h-10 w-64 animate-pulse rounded-notion bg-notion-hover/70" />
      </div>
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

      <SectionEditableHeader
        section={section}
        onSave={(patch) => updateSection(sectionId, patch)}
      />

      <p className="mt-2 px-1 text-sm text-notion-muted">
        Слов: {wordsReady ? words.length : "…"}
      </p>

      <SectionWordsList
        words={words}
        isReady={wordsReady}
        addWord={addWord}
        updateWord={updateWord}
        removeWord={removeWord}
      />
    </article>
  );
}
