"use client";

import { useCallback, useEffect, useState } from "react";

export function useRomanianSpeech() {
  const [available, setAvailable] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }
    setAvailable(true);

    const refreshVoices = () => {
      window.speechSynthesis.getVoices();
    };

    refreshVoices();
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", refreshVoices);
    };
  }, []);

  const speak = useCallback(
    (term: string) => {
      if (!available || typeof window === "undefined") {
        return;
      }

      const voices = window.speechSynthesis.getVoices();
      const romanianVoice = voices.find((voice) =>
        voice.lang.toLowerCase().startsWith("ro"),
      );

      if (!romanianVoice) {
        setLastError("нет румынского голоса");
        return;
      }

      setLastError(null);
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(term);
      utterance.lang = "ro-RO";
      utterance.voice = romanianVoice;
      window.speechSynthesis.speak(utterance);
    },
    [available],
  );

  return { available, speak, lastError };
}
