import { supabase } from "@/lib/supabase";
import type { DictionarySection, DictionaryWord } from "@/types/dictionary";

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
  created_at: string;
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
    createdAt: new Date(row.created_at).getTime(),
  };
}

function throwOnError(error: { message: string } | null): void {
  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchSections(): Promise<DictionarySection[]> {
  const { data, error } = await supabase
    .from("sections")
    .select("*")
    .order("created_at");

  throwOnError(error);
  return (data as SectionRow[] | null)?.map(mapSection) ?? [];
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

export async function fetchWordsBySectionId(
  sectionId: string,
): Promise<DictionaryWord[]> {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("section_id", sectionId)
    .order("created_at");

  throwOnError(error);
  return (data as WordRow[] | null)?.map(mapWord) ?? [];
}

export async function createWord(
  sectionId: string,
  term: string,
  translation: string,
): Promise<DictionaryWord> {
  const { data, error } = await supabase
    .from("words")
    .insert({
      section_id: sectionId,
      term: term.trim(),
      translation: translation.trim(),
    })
    .select()
    .single();

  throwOnError(error);
  return mapWord(data as WordRow);
}

export async function updateWord(
  id: string,
  term: string,
  translation: string,
): Promise<DictionaryWord> {
  const { data, error } = await supabase
    .from("words")
    .update({ term: term.trim(), translation: translation.trim() })
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
