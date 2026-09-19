"use client";

import { useEffect, useRef, useState } from "react";

type DeleteSectionControlProps = {
  sectionTitle: string;
  onConfirm: () => void;
};

export function DeleteSectionControl({
  sectionTitle,
  onConfirm,
}: DeleteSectionControlProps) {
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
        className="flex h-7 w-7 items-center justify-center rounded-notion text-notion-muted opacity-0 transition-opacity hover:bg-notion-hover hover:text-notion-text group-hover:opacity-100 data-[open=true]:opacity-100"
        data-open={open}
        aria-label={`Удалить раздел «${sectionTitle}»`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
      >
        <span aria-hidden className="text-base leading-none">
          ···
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Подтверждение удаления"
          className="absolute right-0 top-full z-20 mt-1 w-52 rounded-notion border border-notion-border bg-notion-bg p-3 shadow-sm"
          onClick={(event) => event.stopPropagation()}
        >
          <p className="text-xs leading-relaxed text-notion-muted">
            Удалить «{sectionTitle}»? Это действие нельзя отменить.
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
