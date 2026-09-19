"use client";

import { useEffect, useRef } from "react";

type NewSectionInlineFormProps = {
  onSave: (title: string, emoji?: string) => boolean | Promise<boolean>;
  onCancel: () => void;
};

export function NewSectionInlineForm({
  onSave,
  onCancel,
}: NewSectionInlineFormProps) {
  const emojiRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const submit = async () => {
    const title = titleRef.current?.value ?? "";
    const emoji = emojiRef.current?.value ?? "";
    const saved = await onSave(title, emoji);
    if (saved) {
      if (emojiRef.current) emojiRef.current.value = "";
      if (titleRef.current) titleRef.current.value = "";
      titleRef.current?.focus();
    }
  };

  return (
    <div className="flex items-center gap-2 rounded-notion px-2 py-1.5">
      <input
        ref={emojiRef}
        type="text"
        maxLength={8}
        placeholder="📄"
        aria-label="Эмодзи раздела"
        className="h-8 w-10 shrink-0 rounded-notion border border-notion-border bg-notion-bg px-1 text-center text-base outline-none focus:border-notion-muted"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void submit();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
          }
        }}
      />
      <input
        ref={titleRef}
        type="text"
        placeholder="Название раздела"
        aria-label="Название раздела"
        className="min-w-0 flex-1 rounded-notion border border-notion-border bg-notion-bg px-2 py-1.5 text-sm text-notion-text outline-none placeholder:text-notion-muted focus:border-notion-muted"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void submit();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            onCancel();
          }
        }}
      />
    </div>
  );
}
