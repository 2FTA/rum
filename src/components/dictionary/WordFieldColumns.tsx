import type { KeyboardEvent, RefObject } from "react";

type WordFieldColumnsProps = {
  term: string;
  translation: string;
  termPlaceholder?: string;
  translationPlaceholder?: string;
  editable?: boolean;
  onTermChange?: (value: string) => void;
  onTranslationChange?: (value: string) => void;
  onTermKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onTranslationKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  termInputRef?: RefObject<HTMLInputElement | null>;
  translationInputRef?: RefObject<HTMLInputElement | null>;
};

export function WordFieldColumns({
  term,
  translation,
  termPlaceholder = "Слово",
  translationPlaceholder = "Перевод",
  editable = false,
  onTermChange,
  onTranslationChange,
  onTermKeyDown,
  onTranslationKeyDown,
  termInputRef,
  translationInputRef,
}: WordFieldColumnsProps) {
  const inputClassName =
    "w-full bg-transparent text-sm outline-none placeholder:text-notion-muted";

  return (
    <div className="min-w-0 flex-1 md:grid md:grid-cols-2 md:gap-0">
      <div className="md:border-r md:border-notion-border md:pr-4">
        {editable ? (
          <input
            ref={termInputRef}
            type="text"
            value={term}
            placeholder={termPlaceholder}
            aria-label="Слово"
            className={`${inputClassName} text-notion-text`}
            onChange={(event) => onTermChange?.(event.target.value)}
            onKeyDown={onTermKeyDown}
          />
        ) : (
          <p className="text-sm text-notion-text">{term}</p>
        )}
      </div>
      <div className="mt-0.5 md:mt-0 md:pl-4">
        {editable ? (
          <input
            ref={translationInputRef}
            type="text"
            value={translation}
            placeholder={translationPlaceholder}
            aria-label="Перевод"
            className={`${inputClassName} text-notion-text md:text-notion-text`}
            onChange={(event) => onTranslationChange?.(event.target.value)}
            onKeyDown={onTranslationKeyDown}
          />
        ) : (
          <p className="text-sm text-notion-muted">{translation || "—"}</p>
        )}
      </div>
    </div>
  );
}
