import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type RuleMarkdownProps = {
  content: string;
};

export function RuleMarkdown({ content }: RuleMarkdownProps) {
  if (!content.trim()) {
    return <p className="text-sm text-notion-muted">—</p>;
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="mb-2 text-sm leading-relaxed text-notion-muted last:mb-0">
            {children}
          </p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-notion-text">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-5 text-sm text-notion-muted">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm text-notion-muted">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-notion-text underline underline-offset-2 hover:text-notion-muted"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="my-2 overflow-x-auto">
            <table className="w-full min-w-[280px] border-collapse text-sm">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead>{children}</thead>,
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
          <tr className="border-b border-notion-border last:border-0">
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="border border-notion-border bg-notion-sidebar px-2 py-2 text-center text-xs font-semibold text-notion-text">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-notion-border px-2 py-2 text-center text-xs text-notion-muted">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
