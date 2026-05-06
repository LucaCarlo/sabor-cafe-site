import { requirePermission } from "@/lib/admin/guard";
import { getAllMedia } from "@/lib/data/site";
import { MediaLibrary } from "./media-library";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await requirePermission("media.view");
  const initial = await getAllMedia();
  return (
    <div>
      <header className="mb-8 flex items-end justify-between">
        <div>
          <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
            Libreria media
          </span>
          <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
            Le tue immagini
          </h1>
          <p className="mt-1 max-w-[60ch] text-[13.5px] text-[var(--color-ink-mute)]">
            Le foto vengono ottimizzate automaticamente: ridimensionate fino a 2200px
            sul lato lungo e convertite in WebP a qualità 80. Velocità del sito garantita.
          </p>
        </div>
      </header>
      <MediaLibrary initial={initial} />
    </div>
  );
}
