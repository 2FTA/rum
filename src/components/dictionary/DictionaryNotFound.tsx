import Link from "next/link";

export function DictionaryNotFound() {
  return (
    <article className="py-8">
      <h1 className="text-2xl font-medium text-notion-text">
        Страница не найдена
      </h1>
      <p className="mt-3 text-sm text-notion-muted">
        Такого раздела словаря не существует или он был удалён.
      </p>
      <Link
        href="/dictionary"
        className="mt-6 inline-block rounded-notion px-1 py-1 text-sm text-notion-text transition-colors hover:bg-notion-hover"
      >
        ← Назад к словарю
      </Link>
    </article>
  );
}
