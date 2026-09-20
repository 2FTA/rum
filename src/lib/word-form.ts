import type { WordFormValues } from "@/types/dictionary";

export function trimOptionalField(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export function normalizeGender(value: string): string | null {
  const trimmed = value.trim();
  if (
    trimmed === "masculin" ||
    trimmed === "feminin" ||
    trimmed === "neutru"
  ) {
    return trimmed;
  }
  return null;
}

export function isWordFormValid(values: WordFormValues): boolean {
  return values.term.trim().length > 0 && values.translation.trim().length > 0;
}

export function wordFormToPayload(values: WordFormValues) {
  return {
    term: values.term.trim(),
    translation: values.translation.trim(),
    plural: trimOptionalField(values.plural),
    gender: normalizeGender(values.gender),
    past_tense: trimOptionalField(values.past_tense),
    article_singular: trimOptionalField(values.article_singular),
    article_plural: trimOptionalField(values.article_plural),
  };
}
