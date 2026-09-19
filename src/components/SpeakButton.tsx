"use client";

import { useRomanianSpeech } from "@/hooks/useRomanianSpeech";
import { SpeakerIcon } from "@/components/icons/SpeakerIcon";

type SpeakButtonProps = {
  term: string;
  className?: string;
};

export function SpeakButton({ term, className = "" }: SpeakButtonProps) {
  const { available, speak, lastError } = useRomanianSpeech();

  if (!available) {
    return null;
  }

  return (
    <button
      type="button"
      title={lastError ?? "Озвучить"}
      aria-label={`Озвучить «${term}»`}
      className={[
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-notion text-notion-muted transition-colors hover:bg-notion-hover hover:text-notion-text md:opacity-0 md:group-hover:opacity-100",
        className,
      ].join(" ")}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        speak(term);
      }}
    >
      <SpeakerIcon className="h-3.5 w-3.5" />
    </button>
  );
}
