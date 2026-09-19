export function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10.5 2.5 13.5 5.5 5.5 13.5H2.5v-3l8-8Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M9 4 12 7"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}
