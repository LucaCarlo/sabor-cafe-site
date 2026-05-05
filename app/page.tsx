import { Hero } from "@/components/hero";
import { LiveStrip } from "@/components/live-strip";
import { Manifesto } from "@/components/manifesto";
import { Carta } from "@/components/carta";
import { Giornata } from "@/components/giornata";
import { Eventi } from "@/components/eventi";
import { Visita } from "@/components/visita";

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="absolute -left-96 top-2 z-50 rounded bg-[var(--color-ink)] px-4 py-3 text-[var(--color-cream)] focus:left-2"
      >
        Vai al contenuto
      </a>
      <Hero />
      <LiveStrip />
      <main id="main">
        <Manifesto />
        <Carta />
        <Giornata />
        <Eventi />
        <Visita />
      </main>
    </>
  );
}
