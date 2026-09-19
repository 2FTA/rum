"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DictionarySection } from "@/types/dictionary";
import { DeleteSectionControl } from "@/components/dictionary/DeleteSectionControl";
import { PencilIcon } from "@/components/icons/PencilIcon";

type SectionListItemProps = {
  section: DictionarySection;
  onUpdate: (
    id: string,
    patch: { title: string; emoji?: string },
  ) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
};

export function SectionListItem({
  section,
  onUpdate,
  onRemove,
}: SectionListItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const [emoji, setEmoji] = useState(section.emoji ?? "");
  const rootRef = useRef<HTMLLIElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setTitle(section.title);
      setEmoji(section.emoji ?? "");
    }
  }, [section.title, section.emoji, isEditing]);

  useEffect(() => {
    if (isEditing) {
      titleRef.current?.focus();
    }
  }, [isEditing]);

  const save = useCallback(async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitle(section.title);
      setEmoji(section.emoji ?? "");
      setIsEditing(false);
      return;
    }
    await onUpdate(section.id, {
      title: trimmedTitle,
      emoji: emoji.trim() || undefined,
    });
    setIsEditing(false);
  }, [emoji, onUpdate, section.emoji, section.id, section.title, title]);

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        void save();
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isEditing, save]);

  const cancel = () => {
    setTitle(section.title);
    setEmoji(section.emoji ?? "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li ref={rootRef} className="rounded-notion px-2 py-1.5">
        <div className="flex items-center gap-2">
          <input
            type="text"
            maxLength={8}
            value={emoji}
            aria-label="Эмодзи раздела"
            placeholder="📄"
            className="h-8 w-10 shrink-0 rounded-notion border border-notion-border bg-notion-bg px-1 text-center text-base outline-none focus:border-notion-muted"
            onChange={(event) => setEmoji(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void save();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                cancel();
              }
            }}
          />
          <input
            ref={titleRef}
            type="text"
            value={title}
            aria-label="Название раздела"
            className="min-w-0 flex-1 rounded-notion border border-notion-border bg-notion-bg px-2 py-1.5 text-sm text-notion-text outline-none focus:border-notion-muted"
            onChange={(event) => setTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void save();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                cancel();
              }
            }}
          />
        </div>
      </li>
    );
  }

  return (
    <li ref={rootRef} className="group flex items-center gap-1 rounded-notion px-1 py-0.5 hover:bg-notion-hover">
      <Link
        href={`/dictionary/section?id=${section.id}`}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-notion px-1 py-1.5"
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center text-[1.125rem] leading-none"
          aria-hidden
        >
          {section.emoji ?? "📄"}
        </span>
        <span className="min-w-0 flex-1 truncate text-sm text-notion-text">
          {section.title}
        </span>
      </Link>
      <button
        type="button"
        aria-label={`Редактировать раздел «${section.title}»`}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-notion text-notion-muted opacity-100 transition-opacity hover:bg-notion-hover hover:text-notion-text md:opacity-0 md:group-hover:opacity-100"
        onClick={() => setIsEditing(true)}
      >
        <PencilIcon className="h-3.5 w-3.5" />
      </button>
      <DeleteSectionControl
        sectionTitle={section.title}
        onConfirm={() => {
          void onRemove(section.id);
        }}
      />
    </li>
  );
}
