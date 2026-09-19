"use client";

import { useEffect, useRef, useState } from "react";
import { WordFieldColumns } from "@/components/dictionary/WordFieldColumns";

type AddWordRowProps = {
  onSave: (term: string, translation: string) => boolean;
  onCancel: () => void;
};

export function AddWordRow({ onSave, onCancel }: AddWordRowProps) {
  const [term, setTerm] = useState("");
  const [translation, setTranslation] = useState("");
  const termRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    termRef.current?.focus();
  }, []);

  const submit = () => {
    const saved = onSave(term, translation);
    if (saved) {
      setTerm("");
      setTranslation("");
      termRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <li>
      <div className="flex items-start rounded-notion px-2 py-2 md:items-center md:py-1.5">
        <WordFieldColumns
          term={term}
          translation={translation}
          editable
          termPlaceholder="Слово"
          translationPlaceholder="Перевод"
          onTermChange={setTerm}
          onTranslationChange={setTranslation}
          onTermKeyDown={handleKeyDown}
          onTranslationKeyDown={handleKeyDown}
          termInputRef={termRef}
        />
      </div>
    </li>
  );
}
