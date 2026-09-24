import { supabase } from "@/lib/supabase";
import type { DictionarySection, DictionaryWord } from "@/types/dictionary";
import type { Rule } from "@/types/rule";

export type SectionRow = {
  id: string;
  title: string;
  emoji: string | null;
  created_at: string;
};

export type WordRow = {
  id: string;
  section_id: string;
  term: string;
  translation: string;
  plural: string | null;
  gender: string | null;
  conjugation: string | null;
  past_tense: string | null;
  article_singular: string | null;
  article_plural: string | null;
  created_at: string;
};

export type WordWritePayload = {
  term: string;
  translation: string;
  plural: string | null;
  gender: string | null;
  conjugation: string | null;
  past_tense: string | null;
  article_singular: string | null;
  article_plural: string | null;
};

export type WordSearchRow = WordRow & {
  sections: { title: string; emoji: string | null } | null;
};

export type WordSearchResult = {
  id: string;
  sectionId: string;
  term: string;
  translation: string;
  sectionTitle: string;
  sectionEmoji?: string;
};

const DEFAULT_SECTION_TEMPLATES: { title: string; emoji: string }[] = [
  { emoji: "🍔", title: "Еда" },
  { emoji: "🏠", title: "Дом" },
  { emoji: "✈️", title: "Путешествия" },
  { emoji: "👨‍👩‍👧", title: "Семья" },
  { emoji: "💼", title: "Работа" },
  { emoji: "🌦", title: "Погода" },
];

function mapSection(row: SectionRow): DictionarySection {
  return {
    id: row.id,
    title: row.title,
    emoji: row.emoji ?? undefined,
    createdAt: new Date(row.created_at).getTime(),
  };
}

function mapWord(row: WordRow): DictionaryWord {
  return {
    id: row.id,
    sectionId: row.section_id,
    term: row.term,
    translation: row.translation,
    plural: row.plural ?? null,
    gender: row.gender ?? null,
    conjugation: row.conjugation ?? null,
    past_tense: row.past_tense ?? null,
    article_singular: row.article_singular ?? null,
    article_plural: row.article_plural ?? null,
    createdAt: new Date(row.created_at).getTime(),
  };
}

function throwOnError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
}

function escapeIlikePattern(value: string): string {
  return value.replace(/[%_,]/g, "\\$&");
}

export async function fetchSections(): Promise<DictionarySection[]> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("created_at");

  throwOnError(error);
  return (data as SectionRow[] | null)?.map(mapSection) ?? [];
}

export async function fetchSectionById(
  id: string,
): Promise<DictionarySection | null> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .eq("id", id)
    .single();

  if (error?.code === "PGRST116") {
    return null;
  }
  throwOnError(error);
  return mapSection(data as SectionRow);
}

/** Если таблица пуста — один раз создаёт стартовые разделы. */
export async function fetchSectionsWithDefaults(): Promise<DictionarySection[]> {
  const sections = await fetchSections();
  if (sections.length > 0) {
    return sections;
  }

  const { error: insertError } = await supabase
    .from("sections")
    .insert(DEFAULT_SECTION_TEMPLATES);

  throwOnError(insertError);
  return fetchSections();
}

export async function createSection(
  title: string,
  emoji?: string,
): Promise<DictionarySection> {
  const { data, error } = await supabase
    .from("sections")
    .insert({ title: title.trim(), emoji: emoji?.trim() || null })
    .select()
    .single();

  throwOnError(error);
  return mapSection(data as SectionRow);
}

export async function updateSection(
  id: string,
  patch: { title?: string; emoji?: string | null },
): Promise<DictionarySection> {
  const payload: { title?: string; emoji?: string | null } = {};
  if (patch.title !== undefined) {
    payload.title = patch.title.trim();
  }
  if (patch.emoji !== undefined) {
    payload.emoji = patch.emoji?.trim() || null;
  }

  const { data, error } = await supabase
    .from("sections")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  throwOnError(error);
  return mapSection(data as SectionRow);
}

export async function deleteSection(id: string): Promise<void> {
  const { error: wordsError } = await supabase
    .from("words")
    .delete()
    .eq("section_id", id);
  throwOnError(wordsError);

  const { error } = await supabase.from("sections").delete().eq("id", id);
  throwOnError(error);
}

export async function fetchWordsBySectionIds(
  sectionIds: string[],
): Promise<DictionaryWord[]> {
  if (sectionIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("words")
    .select("*")
    .in("section_id", sectionIds);

  throwOnError(error);
  return (data as WordRow[] | null)?.map(mapWord) ?? [];
}

export async function fetchWordsBySectionId(
  sectionId: string,
): Promise<DictionaryWord[]> {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("section_id", sectionId)
    .order("created_at", { ascending: false });

  throwOnError(error);
  return (data as WordRow[] | null)?.map(mapWord) ?? [];
}

export async function fetchSectionsByTitle(): Promise<DictionarySection[]> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("title");

  throwOnError(error);
  return (data as SectionRow[] | null)?.map(mapSection) ?? [];
}

export async function searchWords(query: string): Promise<WordSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const pattern = escapeIlikePattern(trimmed);
  const { data, error } = await supabase
    .from("words")
    .select("*, sections(title, emoji)")
    .or(`term.ilike.%${pattern}%,translation.ilike.%${pattern}%`)
    .limit(20);

  throwOnError(error);

  return ((data as WordSearchRow[] | null) ?? []).map((row) => ({
    id: row.id,
    sectionId: row.section_id,
    term: row.term,
    translation: row.translation,
    sectionTitle: row.sections?.title ?? "Раздел",
    sectionEmoji: row.sections?.emoji ?? undefined,
  }));
}

export async function createWord(
  sectionId: string,
  payload: WordWritePayload,
): Promise<DictionaryWord> {
  const { data, error } = await supabase
    .from("words")
    .insert({
      section_id: sectionId,
      term: payload.term,
      translation: payload.translation,
      plural: payload.plural,
      gender: payload.gender,
      conjugation: payload.conjugation,
      past_tense: payload.past_tense,
      article_singular: payload.article_singular,
      article_plural: payload.article_plural,
    })
    .select()
    .single();

  throwOnError(error);
  return mapWord(data as WordRow);
}

export async function updateWord(
  id: string,
  payload: WordWritePayload,
): Promise<DictionaryWord> {
  const { data, error } = await supabase
    .from("words")
    .update({
      term: payload.term,
      translation: payload.translation,
      plural: payload.plural,
      gender: payload.gender,
      conjugation: payload.conjugation,
      past_tense: payload.past_tense,
      article_singular: payload.article_singular,
      article_plural: payload.article_plural,
    })
    .eq("id", id)
    .select()
    .single();

  throwOnError(error);
  return mapWord(data as WordRow);
}

export async function deleteWord(id: string): Promise<void> {
  const { error } = await supabase.from("words").delete().eq("id", id);
  throwOnError(error);
}

export type RuleRow = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

function mapRule(row: RuleRow): Rule {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: new Date(row.created_at).getTime(),
  };
}

export async function fetchRules() {
  const { data, error } = await supabase
    .from("rules")
    .select("*")
    .order("created_at", { ascending: false });

  throwOnError(error);
  return ((data as RuleRow[] | null) ?? []).map(mapRule);
}

export async function createRule(title: string, content: string) {
  const { data, error } = await supabase
    .from("rules")
    .insert({ title: title.trim(), content: content.trim() })
    .select()
    .single();

  throwOnError(error);
  return mapRule(data as RuleRow);
}

export async function updateRule(
  id: string,
  title: string,
  content: string,
) {
  const { data, error } = await supabase
    .from("rules")
    .update({ title: title.trim(), content: content.trim() })
    .eq("id", id)
    .select()
    .single();

  throwOnError(error);
  return mapRule(data as RuleRow);
}

export async function deleteRule(id: string): Promise<void> {
  const { error } = await supabase.from("rules").delete().eq("id", id);
  throwOnError(error);
}
