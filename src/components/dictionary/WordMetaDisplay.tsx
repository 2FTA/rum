import type { DictionaryWord } from "@/types/dictionary";

type WordMetaDisplayProps = {
  word: Pick<
    DictionaryWord,
    | "plural"
    | "gender"
    | "conjugation"
    | "past_tense"
    | "article_singular"
    | "article_plural"
  >;
};

export function WordMetaDisplay({ word }: WordMetaDisplayProps) {
  const details: string[] = [];
  if (word.plural) {
    details.push(`Мн. ч.: ${word.plural}`);
  }
  if (word.gender) {
    details.push(`Род: ${word.gender}`);
  }
  if (word.conjugation) {
    details.push(`Настоящее: ${word.conjugation}`);
  }
  if (word.past_tense) {
    details.push(`Прошлое: ${word.past_tense}`);
  }

  const articleParts: string[] = [];
  if (word.article_singular) {
    articleParts.push(`ед. ч. ${word.article_singular}`);
  }
  if (word.article_plural) {
    articleParts.push(`мн. ч. ${word.article_plural}`);
  }

  if (details.length === 0 && articleParts.length === 0) {
    return null;
  }

  return (
    <div className="mt-1 space-y-0.5">
      {details.length > 0 ? (
        <p className="text-xs leading-relaxed text-notion-muted">
          {details.join(" · ")}
        </p>
      ) : null}
      {articleParts.length > 0 ? (
        <p className="text-xs leading-relaxed text-notion-muted">
          Артикль: {articleParts.join(" · ")}
        </p>
      ) : null}
    </div>
  );
}
