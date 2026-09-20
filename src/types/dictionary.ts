export type DictionarySection = {
  id: string;
  title: string;
  emoji?: string;
  createdAt: number;
};

export type DictionaryWord = {
  id: string;
  sectionId: string;
  term: string;
  translation: string;
  plural: string | null;
  gender: string | null;
  conjugation: string | null;
  past_tense: string | null;
  article_singular: string | null;
  article_plural: string | null;
  createdAt: number;
};

export const WORD_GENDER_OPTIONS = [
  { value: "", label: "" },
  { value: "masculin", label: "masculin" },
  { value: "feminin", label: "feminin" },
  { value: "neutru", label: "neutru" },
] as const;

export type WordFormValues = {
  term: string;
  translation: string;
  plural: string;
  gender: string;
  conjugation: string;
  past_tense: string;
  article_singular: string;
  article_plural: string;
};

export function emptyWordFormValues(): WordFormValues {
  return {
    term: "",
    translation: "",
    plural: "",
    gender: "",
    conjugation: "",
    past_tense: "",
    article_singular: "",
    article_plural: "",
  };
}

export function wordToFormValues(word: DictionaryWord): WordFormValues {
  return {
    term: word.term,
    translation: word.translation,
    plural: word.plural ?? "",
    gender: word.gender ?? "",
    conjugation: word.conjugation ?? "",
    past_tense: word.past_tense ?? "",
    article_singular: word.article_singular ?? "",
    article_plural: word.article_plural ?? "",
  };
}
