import type { DictionarySection, DictionaryWord } from "@/types/dictionary";

export const DICTIONARY_SECTIONS_KEY = "dictionary-sections-v1";
export const DICTIONARY_WORDS_KEY = "dictionary-words-v1";

const DEFAULT_SECTION_TEMPLATES: Pick<DictionarySection, "title" | "emoji">[] = [
  { emoji: "🍔", title: "Еда" },
  { emoji: "🏠", title: "Дом" },
  { emoji: "✈️", title: "Путешествия" },
  { emoji: "👨‍👩‍👧", title: "Семья" },
  { emoji: "💼", title: "Работа" },
  { emoji: "🌦", title: "Погода" },
];

export function createStorageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createDefaultSections(): DictionarySection[] {
  const base = Date.now();
  return DEFAULT_SECTION_TEMPLATES.map((item, index) => ({
    id: createStorageId(),
    title: item.title,
    emoji: item.emoji,
    createdAt: base + index,
  }));
}

export function readDictionarySections(): DictionarySection[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DICTIONARY_SECTIONS_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isDictionarySection);
  } catch {
    return [];
  }
}

export function writeDictionarySections(sections: DictionarySection[]): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(DICTIONARY_SECTIONS_KEY, JSON.stringify(sections));
}

/** Читает разделы; при первом запуске (ключа нет) создаёт стартовый набор. */
export function ensureDictionarySections(): DictionarySection[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(DICTIONARY_SECTIONS_KEY);
  if (raw === null) {
    const defaults = createDefaultSections();
    writeDictionarySections(defaults);
    return defaults;
  }

  return readDictionarySections();
}

export function getDictionarySectionById(
  id: string,
): DictionarySection | undefined {
  return readDictionarySections().find((section) => section.id === id);
}

function isDictionarySection(value: unknown): value is DictionarySection {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    typeof record.createdAt === "number" &&
    (record.emoji === undefined || typeof record.emoji === "string")
  );
}

export function readDictionaryWords(): DictionaryWord[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(DICTIONARY_WORDS_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isDictionaryWord);
  } catch {
    return [];
  }
}

export function writeDictionaryWords(words: DictionaryWord[]): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(DICTIONARY_WORDS_KEY, JSON.stringify(words));
}

export function getWordsBySectionId(sectionId: string): DictionaryWord[] {
  return readDictionaryWords()
    .filter((word) => word.sectionId === sectionId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function addDictionaryWord(
  word: Omit<DictionaryWord, "id" | "createdAt"> & {
    id?: string;
    createdAt?: number;
  },
): DictionaryWord {
  const entry: DictionaryWord = {
    id: word.id ?? createStorageId(),
    sectionId: word.sectionId,
    term: word.term.trim(),
    translation: word.translation.trim(),
    createdAt: word.createdAt ?? Date.now(),
  };
  const next = [...readDictionaryWords(), entry];
  writeDictionaryWords(next);
  return entry;
}

export function updateDictionaryWord(
  id: string,
  patch: Pick<DictionaryWord, "term" | "translation">,
): DictionaryWord | undefined {
  const words = readDictionaryWords();
  let updated: DictionaryWord | undefined;
  const next = words.map((word) => {
    if (word.id !== id) {
      return word;
    }
    updated = {
      ...word,
      term: patch.term.trim(),
      translation: patch.translation.trim(),
    };
    return updated;
  });
  if (!updated) {
    return undefined;
  }
  writeDictionaryWords(next);
  return updated;
}

export function removeDictionaryWord(id: string): void {
  writeDictionaryWords(readDictionaryWords().filter((word) => word.id !== id));
}

export function removeDictionaryWordsBySectionId(sectionId: string): void {
  writeDictionaryWords(
    readDictionaryWords().filter((word) => word.sectionId !== sectionId),
  );
}

function isDictionaryWord(value: unknown): value is DictionaryWord {
  if (!value || typeof value !== "object") {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    typeof record.sectionId === "string" &&
    typeof record.term === "string" &&
    typeof record.translation === "string" &&
    typeof record.createdAt === "number"
  );
}
