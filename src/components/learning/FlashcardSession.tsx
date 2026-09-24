"use client";

import { useCallback, useEffect, useState } from "react";
import type { DictionaryWord } from "@/types/dictionary";
import { SpeakButton } from "@/components/SpeakButton";

export type FlashcardDirection = "ro-ru" | "ru-ro";

type FlashcardSessionProps = {
  words: DictionaryWord[];
  direction: FlashcardDirection;
  onExit: () => void;
};

export function FlashcardSession({
  words: initialWords,
  direction,
  onExit,
}: FlashcardSessionProps) {
  const totalUnique = initialWords.length;
  const [deck, setDeck] = useState(initialWords);
  const [knownCount, setKnownCount] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = deck[0];
  const isComplete = deck.length === 0;

  const flip = useCallback(() => {
    if (!current) {
      return;
    }
    setFlipped((value) => !value);
  }, [current]);

  const markKnown = useCallback(() => {
    if (!current || !flipped) {
      return;
    }
    setDeck((prev) => prev.slice(1));
    setKnownCount((count) => count + 1);
    setFlipped(false);
  }, [current, flipped]);

  const markUnknown = useCallback(() => {
    if (!current || !flipped) {
      return;
    }
    setDeck((prev) => [...prev.slice(1), prev[0]]);
    setFlipped(false);
  }, [current, flipped]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isComplete) {
        return;
      }
      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        flip();
        return;
      }
      if (!flipped) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        markUnknown();
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        markKnown();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flip, flipped, isComplete, markKnown, markUnknown]);

  const frontText =
    direction === "ro-ru" ? current?.term : current?.translation;
  const backText =
    direction === "ro-ru" ? current?.translation : current?.term;
  const showSpeakOnFront = direction === "ro-ru";
  const showSpeakOnBack = direction === "ru-ro";

  if (isComplete) {
    return (
      <div className="mt-8 flex flex-col items-center text-center">
        <h2 className="text-2xl font-medium text-notion-text">Готово!</h2>
        <p className="mt-3 text-sm text-notion-muted">
          Вы прошли {totalUnique}{" "}
          {totalUnique === 1 ? "слово" : totalUnique < 5 ? "слова" : "слов"}.
        </p>
        <button
          type="button"
          className="mt-6 rounded-notion px-3 py-2 text-sm text-notion-text transition-colors hover:bg-notion-hover"
          onClick={onExit}
        >
          Вернуться
        </button>
      </div>
    );
  }

  const progress = totalUnique > 0 ? (knownCount / totalUnique) * 100 : 0;

  return (
    <div className="mt-6">
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-notion-sidebar">
        <div
          className="h-full rounded-full bg-emerald-400/70 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="text-sm text-notion-muted">
          Карточка {knownCount + 1} из {totalUnique}
        </p>
        <button
          type="button"
          className="rounded-notion px-2 py-1 text-sm text-notion-muted transition-colors hover:bg-notion-hover hover:text-notion-text"
          onClick={onExit}
        >
          Выйти
        </button>
      </div>

      <div className="mx-auto flex max-w-[500px] flex-col items-center">
        <div className="w-full [perspective:1000px]">
          <button
            type="button"
            className={[
              "group relative mx-auto block min-h-[220px] w-full rounded-xl bg-notion-bg p-8 text-center shadow-md transition-transform duration-[400ms] [transform-style:preserve-3d]",
              flipped ? "[transform:rotateY(180deg)]" : "",
            ].join(" ")}
            onClick={flip}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl backface-hidden [backface-visibility:hidden]">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-medium text-notion-text">
                  {frontText}
                </span>
                {showSpeakOnFront && current ? (
                  <SpeakButton
                    term={current.term}
                    className="opacity-100 md:opacity-100"
                  />
                ) : null}
              </div>
              {!flipped ? (
                <p className="mt-4 text-xs text-notion-muted">
                  Нажмите на карточку, чтобы увидеть перевод
                </p>
              ) : null}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-medium text-notion-text">
                  {backText}
                </span>
                {showSpeakOnBack && current ? (
                  <SpeakButton
                    term={current.term}
                    className="opacity-100 md:opacity-100"
                  />
                ) : null}
              </div>
            </div>
          </button>
        </div>

        {flipped ? (
          <div className="mt-6 flex w-full max-w-[500px] gap-3">
            <button
              type="button"
              className="flex-1 rounded-notion border border-notion-border bg-notion-sidebar px-4 py-2.5 text-sm text-notion-text transition-colors hover:bg-notion-hover"
              onClick={markUnknown}
            >
              Не знаю
            </button>
            <button
              type="button"
              className="flex-1 rounded-notion border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800 transition-colors hover:bg-emerald-100/80"
              onClick={markKnown}
            >
              Знаю
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
