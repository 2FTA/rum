"use client";

import { useParams } from "next/navigation";
import { DictionarySectionView } from "@/components/dictionary/DictionarySectionView";

export function DictionarySectionPageClient() {
  const params = useParams<{ sectionId: string }>();
  const sectionId = params.sectionId;

  if (!sectionId) {
    return null;
  }

  return <DictionarySectionView sectionId={sectionId} />;
}
