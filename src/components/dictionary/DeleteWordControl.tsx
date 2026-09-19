"use client";

import { useEffect, useRef, useState } from "react";

type DeleteWordControlProps = {
  term: string;
  onConfirm: () => void;
};

export function DeleteWordControl({ term, onConfirm }: DeleteWordControlProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-notion text-notion-muted opacity-100 transition-opacity hover:bg-notion-hover hover:text-notion-text md:opacity-0 md:group-hover:opacity-100 data-[open=true]:opacity-100"
        data-open={open}
        aria-label={`Удалить слово «${term}»`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
        >
          <path
            d="M3.5 4.5h9M6 4.5V3.25A.75.75 0 0 1 6.75 2.5h2.5a.75.75 0 0 1 .75.75V4.5M6.25 7.25v4M9.75 7.25v4M4.75 4.5l.5 8a1 1 0 0 0 1 .875h3.5a1 1 0 0 0 1-.875l.5-8"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Подтверждение удаления"
          className="absolute right-0 top-full z-20 mt-1 w-52 rounded-notion border border-notion-border bg-notion-bg p-3 shadow-sm"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-xs leading-relaxed text-notion-muted">
            Удалить «{term}»?
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              className="rounded-notion px-2 py-1 text-xs text-notion-muted transition-colors hover:bg-notion-hover"
              onClick={() => setOpen(false)}
            >
              Отмена
            </button>
            <button
              type="button"
              className="rounded-notion px-2 py-1 text-xs text-red-600 transition-colors hover:bg-red-50"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              Удалить
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
