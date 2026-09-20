"use client";

import type { KeyboardEvent, RefObject } from "react";
import { WORD_GENDER_OPTIONS, type WordFormValues } from "@/types/dictionary";

type WordFormFieldsProps = {
  values: WordFormValues;
  onChange: (patch: Partial<WordFormValues>) => void;
  onKeyDown?: (
    event: KeyboardEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  termInputRef?: RefObject<HTMLInputElement | null>;
};

const compactFieldClassName =
  "w-full rounded-notion border border-notion-border bg-notion-sidebar px-2 py-1 text-xs text-notion-text outline-none placeholder:text-notion-muted focus:border-notion-muted";

const compactSelectClassName = `${compactFieldClassName} appearance-none bg-[length:12px] bg-[right_0.4rem_center] bg-no-repeat pr-7 [background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='m4 6 4 4 4-4' stroke='%23787774' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")]`;

const mainInputClassName =
  "w-full bg-transparent text-sm outline-none placeholder:text-notion-muted";

export function WordFormFields({
  values,
  onChange,
  onKeyDown,
  termInputRef,
}: WordFormFieldsProps) {
  const genderValue = WORD_GENDER_OPTIONS.some(
    (option) => option.value === values.gender,
  )
    ? values.gender
    : "";

  return (
    <div className="min-w-0 flex-1 space-y-3">
      <div className="md:grid md:grid-cols-2 md:gap-0">
        <div className="md:border-r md:border-notion-border md:pr-4">
          <label className="mb-1 block text-xs text-notion-muted md:sr-only">
            Слово
          </label>
          <input
            ref={termInputRef}
            type="text"
            value={values.term}
            placeholder="Слово"
            aria-label="Слово"
            className={`${mainInputClassName} text-notion-text`}
            onChange={(event) => onChange({ term: event.target.value })}
            onKeyDown={onKeyDown}
          />
        </div>
        <div className="mt-2 md:mt-0 md:pl-4">
          <label className="mb-1 block text-xs text-notion-muted md:sr-only">
            Перевод
          </label>
          <input
            type="text"
            value={values.translation}
            placeholder="Перевод"
            aria-label="Перевод"
            className={`${mainInputClassName} text-notion-text`}
            onChange={(event) => onChange({ translation: event.target.value })}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block">
          <span className="mb-1 block text-xs text-notion-muted">Мн. ч.</span>
          <input
            type="text"
            value={values.plural}
            className={compactFieldClassName}
            onChange={(event) => onChange({ plural: event.target.value })}
            onKeyDown={onKeyDown}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-notion-muted">Род</span>
          <select
            value={genderValue}
            aria-label="Род"
            className={compactSelectClassName}
            onChange={(event) => onChange({ gender: event.target.value })}
            onKeyDown={onKeyDown}
          >
            {WORD_GENDER_OPTIONS.map((option) => (
              <option key={option.value || "empty"} value={option.value}>
                {option.label || "\u00a0"}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-notion-muted">Спряжение</span>
          <input
            type="text"
            value={values.conjugation}
            className={compactFieldClassName}
            onChange={(event) => onChange({ conjugation: event.target.value })}
            onKeyDown={onKeyDown}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-notion-muted">Прошлое</span>
          <input
            type="text"
            value={values.past_tense}
            className={compactFieldClassName}
            onChange={(event) => onChange({ past_tense: event.target.value })}
            onKeyDown={onKeyDown}
          />
        </label>
      </div>

      <div className="rounded-notion border border-notion-border bg-notion-sidebar p-2.5">
        <p className="mb-2 text-xs font-medium text-notion-muted">Артикль</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs text-notion-muted">Ед.ч</span>
            <input
              type="text"
              value={values.article_singular}
              className={compactFieldClassName}
              onChange={(event) =>
                onChange({ article_singular: event.target.value })
              }
              onKeyDown={onKeyDown}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs text-notion-muted">Мн.ч</span>
            <input
              type="text"
              value={values.article_plural}
              className={compactFieldClassName}
              onChange={(event) =>
                onChange({ article_plural: event.target.value })
              }
              onKeyDown={onKeyDown}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
