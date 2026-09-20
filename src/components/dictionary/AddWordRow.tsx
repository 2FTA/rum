"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { WordFormFields } from "@/components/dictionary/WordFormFields";
import { emptyWordFormValues, type WordFormValues } from "@/types/dictionary";

type AddWordRowProps = {
  onSave: (values: WordFormValues) => Promise<boolean>;
  onCancel: () => void;
};

export function AddWordRow({ onSave, onCancel }: AddWordRowProps) {
  const [values, setValues] = useState<WordFormValues>(emptyWordFormValues());
  const termRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    termRef.current?.focus();
  }, []);

  const submit = async () => {
    const saved = await onSave(values);
    if (saved) {
      setValues(emptyWordFormValues());
      termRef.current?.focus();
    }
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void submit();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      onCancel();
    }
  };

  return (
    <li>
      <div className="rounded-notion px-2 py-2">
        <WordFormFields
          values={values}
          onChange={(patch) => setValues((prev) => ({ ...prev, ...patch }))}
          onKeyDown={handleKeyDown}
          termInputRef={termRef}
        />
      </div>
    </li>
  );
}
