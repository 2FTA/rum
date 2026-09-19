import { DictionarySectionsList } from "@/components/dictionary/DictionarySectionsList";

export default function DictionaryPage() {
  return (
    <article>
      <h1 className="text-[1.875rem] font-medium leading-snug tracking-tight text-notion-text md:text-[2.5rem]">
        Словарь
      </h1>
      <DictionarySectionsList />
    </article>
  );
}
