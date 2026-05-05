# Sabor Café

Sito vetrina per **Sabor Café** — bar contemporaneo a Civitanova.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** (CSS-first config, `@theme` inline)
- **Framer Motion** — animazioni reveal/parallax
- **GSAP** — timeline avanzate
- **Lenis** — smooth scroll
- **lucide-react** — icone

## Sviluppo

```bash
npm install
npm run dev
```

→ http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Deploy

Hostato su **Vercel**. Push su `main` → deploy automatico.

## Da personalizzare

- Foto reali del bar (sostituire URL Unsplash)
- Logo dorato originale (al posto del monogramma "S")
- Indirizzo, orari, telefono nella sezione Contatti
- Dominio definitivo (`metadataBase` in `app/layout.tsx`)
