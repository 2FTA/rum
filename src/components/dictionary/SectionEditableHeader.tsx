"use client";

import { useEffect, useRef, useState } from "react";
import type { DictionarySection } from "@/types/dictionary";

type SectionEditableHeaderProps = {
  section: DictionarySection;
  onSave: (patch: { title: string; emoji?: string }) => void;
};

export function SectionEditableHeader({
  section,
  onSave,
}: SectionEditableHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [emoji, setEmoji] = useState(section.emoji ?? "");
  const [title, setTitle] = useState(section.title);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setEmoji(section.emoji ?? "");
      setTitle(section.title);
    }
  }, [section.emoji, section.title, isEditing]);

  useEffect(() => {
    if (isEditing) {
      titleRef.current?.focus();
      titleRef.current?.select();
    }
  }, [isEditing]);

  const save = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitle(section.title);
      setEmoji(section.emoji ?? "");
      setIsEditing(false);
      return;
    }
    onSave({
      title: trimmedTitle,
      emoji: emoji.trim() || undefined,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        className="mt-4 flex items-start gap-3"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            save();
          }
        }}
      >
        <input
          type="text"
          maxLength={8}
          value={emoji}
          aria-label="Эмодзи раздела"
          placeholder="📄"
          className="mt-1 h-10 w-11 shrink-0 rounded-notion border border-notion-border bg-notion-bg px-1 text-center text-xl outline-none focus:border-notion-muted"
          onChange={(event) => setEmoji(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              save();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setEmoji(section.emoji ?? "");
              setTitle(section.title);
              setIsEditing(false);
            }
          }}
        />
        <input
          ref={titleRef}
          type="text"
          value={title}
          aria-label="Название раздела"
          className="min-w-0 flex-1 rounded-notion border border-notion-border bg-notion-bg px-2 py-1.5 text-[1.875rem] font-medium leading-snug text-notion-text outline-none focus:border-notion-muted md:text-[2.5rem]"
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              save();
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setEmoji(section.emoji ?? "");
              setTitle(section.title);
              setIsEditing(false);
            }
          }}
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      className="mt-4 flex w-full items-center gap-3 rounded-notion px-1 py-1 text-left transition-colors hover:bg-notion-hover"
      onClick={() => setIsEditing(true)}
    >
      <span className="text-3xl leading-none" aria-hidden>
        {section.emoji ?? "📄"}
      </span>
      <span className="text-[1.875rem] font-medium leading-snug tracking-tight text-notion-text md:text-[2.5rem]">
        {section.title}
      </span>
    </button>
  );
}
