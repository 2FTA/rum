export const RULE_MARKDOWN_TABLE_TEMPLATE = `| Заголовок 1 | Заголовок 2 |
|-------------|-------------|
| Текст       | Текст       |
| Текст       | Текст       |
`;

export function insertTextAtCursor(
  value: string,
  selectionStart: number,
  selectionEnd: number,
  insertText: string,
): { nextValue: string; cursor: number } {
  const nextValue =
    value.slice(0, selectionStart) + insertText + value.slice(selectionEnd);
  const cursor = selectionStart + insertText.length;
  return { nextValue, cursor };
}
