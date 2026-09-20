"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Rule } from "@/types/rule";
import { RuleListItem } from "@/components/rules/RuleListItem";
import {
  createRule,
  deleteRule,
  fetchRules,
  updateRule,
} from "@/lib/data";

const fieldClassName =
  "w-full rounded-notion border border-notion-border bg-notion-sidebar px-2 py-1.5 text-sm text-notion-text outline-none focus:border-notion-muted";

export function RulesView() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  const loadRules = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchRules();
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить правила.");
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    void loadRules();
  }, [loadRules]);

  useEffect(() => {
    if (isAdding) {
      titleRef.current?.focus();
    }
  }, [isAdding]);

  const saveNewRule = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    setError(null);
    try {
      const rule = await createRule(trimmedTitle, content);
      setRules((prev) => [rule, ...prev]);
      setTitle("");
      setContent("");
      setIsAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить правило.");
    }
  };

  if (!isReady) {
    return <p className="mt-8 text-sm text-notion-muted">Загрузка...</p>;
  }

  const isEmpty = rules.length === 0 && !isAdding;

  return (
    <article>
      <h1 className="text-[1.875rem] font-medium leading-snug tracking-tight text-notion-text md:text-[2.5rem]">
        Правила
      </h1>

      <div className="mt-6">
        {error ? (
          <p className="mb-4 rounded-notion border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {!isAdding ? (
          <button
            type="button"
            className="rounded-notion px-1 py-1 text-sm text-notion-muted transition-colors hover:bg-notion-hover hover:text-notion-text"
            onClick={() => setIsAdding(true)}
          >
            + Добавить правило
          </button>
        ) : null}

        {isAdding ? (
          <div className="mt-2 rounded-notion border border-notion-border bg-notion-bg px-3 py-3">
            <input
              ref={titleRef}
              type="text"
              value={title}
              placeholder="Название"
              aria-label="Название"
              className={`${fieldClassName} font-medium`}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void saveNewRule();
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  setIsAdding(false);
                  setTitle("");
                  setContent("");
                }
              }}
            />
            <textarea
              value={content}
              placeholder="Содержание"
              aria-label="Содержание"
              rows={5}
              className={`${fieldClassName} mt-2 min-h-[120px] resize-y`}
              onChange={(event) => setContent(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setIsAdding(false);
                  setTitle("");
                  setContent("");
                }
              }}
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="rounded-notion px-2 py-1 text-sm text-notion-text hover:bg-notion-hover"
                onClick={() => {
                  void saveNewRule();
                }}
              >
                Сохранить
              </button>
              <button
                type="button"
                className="rounded-notion px-2 py-1 text-sm text-notion-muted hover:bg-notion-hover"
                onClick={() => {
                  setIsAdding(false);
                  setTitle("");
                  setContent("");
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        ) : null}

        {isEmpty ? (
          <p className="mt-6 text-sm text-notion-muted">
            Пока нет ни одного правила. Добавьте первое.
          </p>
        ) : (
          <ul className="mt-3 flex flex-col gap-2">
            {rules.map((rule) => (
              <RuleListItem
                key={rule.id}
                rule={rule}
                onUpdate={async (id, nextTitle, nextContent) => {
                  const updated = await updateRule(id, nextTitle, nextContent);
                  setRules((prev) =>
                    prev.map((item) => (item.id === id ? updated : item)),
                  );
                }}
                onRemove={async (id) => {
                  await deleteRule(id);
                  setRules((prev) => prev.filter((item) => item.id !== id));
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
