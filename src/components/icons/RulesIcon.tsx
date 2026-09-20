export function RulesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3.5 2.75h7.25A1.25 1.25 0 0 1 12 4v9.75a.75.75 0 0 1-1.15.635L8 12.25l-2.85 1.385A.75.75 0 0 1 4 13.75V4A1.25 1.25 0 0 1 5.25 2.75H3.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M6 5.5h4M6 8h4"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
