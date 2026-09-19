import { DictionarySectionPageClient } from "./DictionarySectionPageClient";

/** Заглушка для static export; реальные id обслуживаются через SPA-fallback (404.html). */
export function generateStaticParams() {
  return [{ sectionId: "_" }];
}

export default function DictionarySectionPage() {
  return <DictionarySectionPageClient />;
}
