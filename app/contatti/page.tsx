import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContactBlock } from "@/components/contact-block";

export const metadata: Metadata = {
  title: "Visita",
  description:
    "Vieni a trovarci a Maison Sabor, Civitanova Marche. Orari, indirizzo, prenotazioni.",
};

export default function ContattiPage() {
  return (
    <>
      <PageHeader
        n=".04"
        kicker="Visita"
        title={["Riserva, scrivici,", "vienici", "a trovare."]}
        accent="vienici"
        sub="Per una prenotazione, un evento privato, una collaborazione o anche solo per dirci qualcosa — la porta è sempre aperta. Anche quella digitale."
        photos={[
          "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85",
        ]}
      />
      <main id="main">
        <ContactBlock />
      </main>
    </>
  );
}
