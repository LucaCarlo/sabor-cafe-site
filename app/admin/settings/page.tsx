import { requireAdmin } from "@/lib/admin/guard";
import { getSettings } from "@/lib/data/site";
import { Field, FormSection, Input, Textarea } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";
import { SaveBar } from "@/components/admin/save-bar";
import { saveSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();
  const s = await getSettings();

  return (
    <div>
      <header className="mb-8">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Impostazioni
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Impostazioni globali del sito
        </h1>
        <p className="mt-1 max-w-[60ch] text-[13.5px] text-[var(--color-ink-mute)]">
          Brand, contatti, social, orari di apertura, SEO. Compaiono in nav,
          footer, metadati e schema.org.
        </p>
      </header>

      <form action={saveSettings} className="space-y-6">
        <FormSection title="Brand & identità">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Nome 1ª riga" hint="Ex. 'Maison'">
              <Input name="brand_primary" defaultValue={s?.brand_primary ?? "Maison"} />
            </Field>
            <Field label="Nome 2ª riga" hint="Ex. 'Sabor' (in italico)">
              <Input name="brand_secondary" defaultValue={s?.brand_secondary ?? "Sabor"} />
            </Field>
            <Field label="Nome completo" hint="Per metadata, schema.org, og:title">
              <Input name="brand_full" defaultValue={s?.brand_full ?? "Maison Sabor"} />
            </Field>
            <Field label="Anno (numerali romani per kicker)">
              <Input name="meta_year" defaultValue={s?.meta_year ?? "MMXXVI"} />
            </Field>
            <Field label="Edizione (footer)" className="md:col-span-2">
              <Input name="edition_label" defaultValue={s?.edition_label ?? "Édition 2026"} />
            </Field>
            <Field label="Descrizione (SEO)" className="md:col-span-2"
              hint="Usata in meta description e schema.org">
              <Textarea name="description" rows={3} defaultValue={s?.description ?? ""} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ImagePicker
              name="logo_media_id"
              label="Logo (opzionale)"
              value={s?.logo_media_id}
              fallbackUrl={s?.logo_url}
            />
            <ImagePicker
              name="og_image_media_id"
              label="Immagine condivisione (Open Graph)"
              value={s?.og_image_media_id}
              fallbackUrl={s?.og_image_url}
            />
          </div>
        </FormSection>

        <FormSection title="Contatti">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Email contatto">
              <Input type="email" name="email" defaultValue={s?.email ?? ""} />
            </Field>
            <Field label="Telefono">
              <Input name="phone" defaultValue={s?.phone ?? ""} placeholder="+39 ..." />
            </Field>
            <Field label="Indirizzo (testo libero)">
              <Input name="address" defaultValue={s?.address ?? "Civitanova Marche · Italia"} />
            </Field>
            <Field label="Città">
              <Input name="city" defaultValue={s?.city ?? "Civitanova Marche"} />
            </Field>
            <Field label="Paese (codice ISO)" hint="IT, FR, DE…">
              <Input name="country" defaultValue={s?.country ?? "IT"} />
            </Field>
            <Field label="URL del sito" hint="Senza slash finale">
              <Input name="site_url" defaultValue={s?.site_url ?? "https://saborcafe.it"} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Social">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Instagram URL">
              <Input name="instagram_url" defaultValue={s?.instagram_url ?? "https://www.instagram.com/sabor.cafe/"} />
            </Field>
            <Field label="Instagram handle">
              <Input name="instagram_handle" defaultValue={s?.instagram_handle ?? "@sabor.cafe"} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Orari di apertura" description="Mostrati in hero, nav, live-strip, footer e visita.">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Etichetta giorni feriali">
              <Input name="hours_weekday_label" defaultValue={s?.hours_weekday_label ?? "Lun — Ven"} />
            </Field>
            <Field label="Orario feriali">
              <Input name="hours_weekday" defaultValue={s?.hours_weekday ?? "07:00 — 23:00"} />
            </Field>
            <Field label="Etichetta weekend">
              <Input name="hours_weekend_label" defaultValue={s?.hours_weekend_label ?? "Sab — Dom"} />
            </Field>
            <Field label="Orario weekend">
              <Input name="hours_weekend" defaultValue={s?.hours_weekend ?? "08:00 — 24:00"} />
            </Field>
            <Field label="Etichetta cucina">
              <Input name="hours_kitchen_label" defaultValue={s?.hours_kitchen_label ?? "Cucina"} />
            </Field>
            <Field label="Orario cucina">
              <Input name="hours_kitchen" defaultValue={s?.hours_kitchen ?? "12:00 — 22:00"} />
            </Field>
            <Field label="Ora apertura (per banner Aperti/Chiusi)" hint="0–23. Es. 7">
              <Input type="number" min={0} max={23} name="open_hour" defaultValue={s?.open_hour ?? 7} />
            </Field>
            <Field label="Ora chiusura" hint="0–23. Es. 23">
              <Input type="number" min={0} max={23} name="close_hour" defaultValue={s?.close_hour ?? 23} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="SEO & Schema.org">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Fascia di prezzo" hint="€, €€, €€€">
              <Input name="price_range" defaultValue={s?.price_range ?? "€€"} />
            </Field>
            <Field label="Tipi di cucina servita" hint="Separati da virgola. Per schema.org">
              <Input name="serves_cuisine" defaultValue={s?.serves_cuisine ?? "Caffè, Colazione, Pranzo, Aperitivo"} />
            </Field>
            <Field label="Coordinate latitudine">
              <Input type="number" step="0.000001" name="coords_lat" defaultValue={s?.coords_lat ?? 43.3} />
            </Field>
            <Field label="Coordinate longitudine">
              <Input type="number" step="0.000001" name="coords_lng" defaultValue={s?.coords_lng ?? 13.72} />
            </Field>
            <Field label="Etichetta coordinate (visualizzata)" className="md:col-span-2"
              hint="Ex. 43°18′N · 13°43′E">
              <Input name="coords_label" defaultValue={s?.coords_label ?? "43°18′N · 13°43′E"} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Pulsante 'Riserva' (presente in tutto il sito)">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Etichetta pulsante">
              <Input name="reservation_label" defaultValue={s?.reservation_label ?? "Riserva un tavolo"} />
            </Field>
            <Field label="Link pulsante" hint="Pagina interna (es. /contatti) o URL esterno">
              <Input name="reservation_href" defaultValue={s?.reservation_href ?? "/contatti"} />
            </Field>
          </div>
        </FormSection>

        <SaveBar />
      </form>
    </div>
  );
}
