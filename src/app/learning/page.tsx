"use client";

import { useCallback, useState } from "react";
import type { DictionaryWord } from "@/types/dictionary";
import {
  FlashcardSession,
  type FlashcardDirection,
} from "@/components/learning/FlashcardSession";
import { TopicSelectModal } from "@/components/learning/TopicSelectModal";
import { fetchWordsBySectionIds } from "@/lib/data";
import { shuffleArray } from "@/lib/shuffle";

type ActiveSession = {
  words: DictionaryWord[];
  direction: FlashcardDirection;
};

export default function LearningPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [session, setSession] = useState<ActiveSession | null>(null);

  const handleStart = useCallback(
    async (sectionIds: string[], direction: FlashcardDirection) => {
      try {
        const words = await fetchWordsBySectionIds(sectionIds);
        if (words.length === 0) {
          return {
            ok: false as const,
            message: "В выбранных темах нет слов",
          };
        }
        setSession({
          words: shuffleArray(words),
          direction,
        });
        return { ok: true as const };
      } catch (err) {
        return {
          ok: false as const,
          message:
            err instanceof Error
              ? err.message
              : "Не удалось загрузить слова.",
        };
      }
    },
    [],
  );

  if (session) {
    return (
      <article>
        <h1 className="text-[1.875rem] font-medium leading-snug tracking-tight text-notion-text md:text-[2.5rem]">
          Обучение
        </h1>
        <FlashcardSession
          words={session.words}
          direction={session.direction}
          onExit={() => setSession(null)}
        />
      </article>
    );
  }

  return (
    <article>
      <h1 className="text-[1.875rem] font-medium leading-snug tracking-tight text-notion-text md:text-[2.5rem]">
        Обучение
      </h1>

      <ul className="mt-6 flex flex-col">
        <li>
          <button
            type="button"
            className="group flex w-full items-center gap-2 rounded-notion px-2 py-2 text-left transition-colors hover:bg-notion-hover"
            onClick={() => setModalOpen(true)}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center text-[1.125rem] leading-none">
              🃏
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-notion-text">
                Карточки для запоминания
              </span>
              <span className="mt-0.5 block text-xs text-notion-muted">
                Выберите темы и повторяйте слова
              </span>
            </span>
          </button>
        </li>
      </ul>

      <TopicSelectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onStart={handleStart}
      />
    </article>
  );
}
