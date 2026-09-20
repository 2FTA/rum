"use client";

import { useState } from "react";
import { TopicSelectModal } from "@/components/learning/TopicSelectModal";

export default function LearningPage() {
  const [modalOpen, setModalOpen] = useState(false);

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

      <TopicSelectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </article>
  );
}
