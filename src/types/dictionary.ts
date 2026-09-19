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
  createdAt: number;
};
