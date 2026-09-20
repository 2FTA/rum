export function LearningIcon({ className }: { className?: string }) {
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
        d="M2.5 5.5 8 2.75 13.5 5.5V10c0 1.25-2 2.25-5.5 2.25S2.5 11.25 2.5 10V5.5Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path
        d="M8 2.75v9.75M5 12.5v1.75c0 .75 1.35 1.25 3 1.25s3-.5 3-1.25V12.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
