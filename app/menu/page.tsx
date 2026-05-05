import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { MenuFull } from "@/components/menu-full";

export const metadata: Metadata = {
  title: "Carta",
  description:
    "La carta completa di Maison Sabor: caffè, cucina, aperitivo, pasticceria. Civitanova Marche.",
};

export default function MenuPage() {
  return (
    <>
      <PageHeader
        n=".02"
        kicker="La carta"
        title={["Quattro capitoli,", "una", "sola idea."]}
        accent="una"
        sub="La nostra carta cambia con la stagione. Quello che trovi qui è la selezione attuale — per il piatto del giorno e le novità, basta chiedere al banco."
        photos={[
          "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85",
        ]}
      />
      <main id="main">
        <MenuFull />
      </main>
    </>
  );
}
