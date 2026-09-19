export function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M3.5 5.5v5l3 2V3.5l-3 2Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 5.5a3 3 0 0 1 0 5M11.5 3.5a5.5 5.5 0 0 1 0 9"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}
