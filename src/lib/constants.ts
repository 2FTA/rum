export const SITE_NAME = "LinguaFlow";

export const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/languages", label: "Языки" },
  { href: "/lessons", label: "Уроки" },
  { href: "/about", label: "О проекте" },
] as const;

export const FEATURES = [
  {
    title: "Интерактивные уроки",
    description:
      "Короткие задания с мгновенной обратной связью — от слов до диалогов.",
    icon: "📚",
  },
  {
    title: "Интервальное повторение",
    description:
      "Алгоритм напоминает материал в нужный момент, чтобы вы не забывали.",
    icon: "🔄",
  },
  {
    title: "Отслеживание прогресса",
    description: "Уровни, серии дней и статистика мотивируют учиться каждый день.",
    icon: "📈",
  },
  {
    title: "Аудирование и произношение",
    description: "Тренируйте слух и речь с озвучкой носителей языка.",
    icon: "🎧",
  },
] as const;
