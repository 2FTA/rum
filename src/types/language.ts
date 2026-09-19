export type LanguageLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type Language = {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  level: LanguageLevel;
};
