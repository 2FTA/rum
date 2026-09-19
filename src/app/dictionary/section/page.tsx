"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { DictionarySectionView } from "@/components/dictionary/DictionarySectionView";
import { fetchSectionById } from "@/lib/data";

function DictionarySectionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionId = searchParams.get("id") ?? "";
  const [isChecking, setIsChecking] = useState(true);
  const [exists, setExists] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionId) {
      router.replace("/dictionary");
      return;
    }

    let cancelled = false;
    void (async () => {
      setIsChecking(true);
      setError(null);
      try {
        const section = await fetchSectionById(sectionId);
        if (cancelled) {
          return;
        }
        if (!section) {
          setExists(false);
        } else {
          setExists(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Не удалось загрузить раздел.",
          );
          setExists(false);
        }
      } finally {
        if (!cancelled) {
          setIsChecking(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sectionId, router]);

  if (!sectionId) {
    return null;
  }

  if (isChecking) {
    return <p className="text-sm text-notion-muted">Загрузка...</p>;
  }

  if (error) {
    return (
      <p className="rounded-notion border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!exists) {
    return (
      <article>
        <h1 className="text-2xl font-medium text-notion-text">Раздел не найден</h1>
        <Link
          href="/dictionary"
          className="mt-4 inline-block rounded-notion px-1 py-1 text-sm text-notion-text transition-colors hover:bg-notion-hover"
        >
          ← Назад к словарю
        </Link>
      </article>
    );
  }

  return <DictionarySectionView sectionId={sectionId} />;
}

export default function DictionarySectionPage() {
  return (
    <Suspense fallback={<p className="text-sm text-notion-muted">Загрузка...</p>}>
      <DictionarySectionPageContent />
    </Suspense>
  );
}
