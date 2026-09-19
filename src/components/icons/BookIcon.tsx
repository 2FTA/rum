export function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M2.5 2.75A1.75 1.75 0 0 1 4.25 1h5.5A1.75 1.75 0 0 1 11.5 2.75v10.5c0 .414-.336.75-.75.75H4.25A1.75 1.75 0 0 1 2.5 12.25V2.75Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 3.5h1.25A1.75 1.75 0 0 1 14.5 5.25v8c0 .414-.336.75-.75.75h-2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
