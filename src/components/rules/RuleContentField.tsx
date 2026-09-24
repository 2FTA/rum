"use client";

import { useRef, type KeyboardEvent } from "react";
import {
  insertTextAtCursor,
  RULE_MARKDOWN_TABLE_TEMPLATE,
} from "@/lib/rule-content";

type RuleContentFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  className?: string;
};

export function RuleContentField({
  value,
  onChange,
  onKeyDown,
  className = "",
}: RuleContentFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertTable = () => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(`${value}${value.endsWith("\n") || value.length === 0 ? "" : "\n"}${RULE_MARKDOWN_TABLE_TEMPLATE}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const prefix =
      value.length > 0 && start > 0 && value[start - 1] !== "\n" ? "\n" : "";
    const insertText = `${prefix}${RULE_MARKDOWN_TABLE_TEMPLATE}`;
    const { nextValue } = insertTextAtCursor(value, start, end, insertText);
    onChange(nextValue);
    const tableStart = start + prefix.length;
    const firstCellCursor = tableStart + 2;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(firstCellCursor, firstCellCursor);
    });
  };

  return (
    <div>
      <p className="text-xs leading-relaxed text-notion-muted">
        Поддерживается Markdown: **жирный**, *курсив*, списки через «- »,
        таблицы через | разделитель.
      </p>
      <button
        type="button"
        className="mt-2 rounded-notion px-1 py-0.5 text-xs text-notion-muted transition-colors hover:bg-notion-hover hover:text-notion-text"
        onClick={insertTable}
      >
        Вставить таблицу
      </button>
      <textarea
        ref={textareaRef}
        value={value}
        aria-label="Содержание"
        placeholder="Содержание"
        rows={5}
        className={className}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
