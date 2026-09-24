"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Rule } from "@/types/rule";
import { DeleteRuleControl } from "@/components/rules/DeleteRuleControl";
import { RuleContentField } from "@/components/rules/RuleContentField";
import { RuleMarkdown } from "@/components/rules/RuleMarkdown";
import { PencilIcon } from "@/components/icons/PencilIcon";

type RuleListItemProps = {
  rule: Rule;
  onUpdate: (id: string, title: string, content: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
};

const fieldClassName =
  "w-full rounded-notion border border-notion-border bg-notion-sidebar px-2 py-1.5 text-sm text-notion-text outline-none focus:border-notion-muted";

export function RuleListItem({ rule, onUpdate, onRemove }: RuleListItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(rule.title);
  const [content, setContent] = useState(rule.content);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setTitle(rule.title);
      setContent(rule.content);
    }
  }, [rule.title, rule.content, isEditing]);

  useEffect(() => {
    if (isEditing) {
      titleRef.current?.focus();
    }
  }, [isEditing]);

  const save = useCallback(async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitle(rule.title);
      setContent(rule.content);
      setIsEditing(false);
      return;
    }
    await onUpdate(rule.id, trimmedTitle, content);
    setIsEditing(false);
  }, [content, onUpdate, rule.content, rule.id, rule.title, title]);

  const cancel = () => {
    setTitle(rule.title);
    setContent(rule.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="rounded-notion border border-notion-border bg-notion-bg px-3 py-3">
        <input
          ref={titleRef}
          type="text"
          value={title}
          aria-label="Название"
          placeholder="Название"
          className={`${fieldClassName} font-medium`}
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
        <RuleContentField
          value={content}
          className={`${fieldClassName} mt-2 min-h-[120px] resize-y`}
          onChange={setContent}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              cancel();
            }
          }}
        />
      </li>
    );
  }

  return (
    <li className="group rounded-notion border border-notion-border bg-notion-bg">
      <div className="flex items-start gap-1 px-2 py-1">
        <button
          type="button"
          className="min-w-0 flex-1 rounded-notion px-1 py-1.5 text-left transition-colors hover:bg-notion-hover"
          onClick={() => setExpanded((value) => !value)}
        >
          <span className="block text-sm font-medium text-notion-text">
            {rule.title}
          </span>
          {expanded ? (
            <div className="mt-2">
              <RuleMarkdown content={rule.content} />
            </div>
          ) : null}
        </button>
        <button
          type="button"
          aria-label={`Редактировать «${rule.title}»`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-notion text-notion-muted opacity-100 transition-opacity hover:bg-notion-hover hover:text-notion-text md:opacity-0 md:group-hover:opacity-100"
          onClick={() => setIsEditing(true)}
        >
          <PencilIcon className="h-3.5 w-3.5" />
        </button>
        <DeleteRuleControl
          title={rule.title}
          onConfirm={() => {
            void onRemove(rule.id);
          }}
        />
      </div>
    </li>
  );
}
