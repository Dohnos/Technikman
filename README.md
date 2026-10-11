# Proklepto · v1.0.0

Web nezávislého technika pro **prověrku ojetých aut** – Olomoucký kraj a celá Morava.

## Technologie

- **[Astro](https://astro.build)**: statické HTML, téměř žádný JavaScript. Výsledek je rychlý web, který Google snadno indexuje.
- Čisté CSS s design tokeny (`src/styles/global.css`), CSS je vložené přímo do HTML.
- Self-hostované variabilní fonty (Bricolage Grotesque + Inter) s preloadem.
- Animace: CSS + jeden malý `IntersectionObserver` (scroll reveal). Respektuje `prefers-reduced-motion`.

## SEO

- Unikátní `title`, `description`, canonical, Open Graph a Twitter karty na každé stránce.
- Strukturovaná data JSON-LD: `AutomotiveBusiness`, `WebSite`, `FAQPage`, `Service` a `BreadcrumbList`.
- Lokální landing pages `/proverka-auta/<mesto>/` (Olomouc, Prostějov, Přerov, Šumperk, Jeseník, Hranice, Brno, Vyškov, Zlín, Kroměříž, Ostrava) a rozcestník `/proverka-auta/`.
- `sitemap-index.xml` (automaticky), `robots.txt`, web manifest, favicony, OG obrázek.

## Úpravy obsahu

| Co | Kde |
| --- | --- |
| Telefon, e-mail, otevírací doba, ceny, doprava | `src/data/site.ts` |
| Co kontrolujeme, kroky, FAQ, značky | `src/data/site.ts` |
| Města a jejich texty | `src/data/regions.ts` |
| Doména | `astro.config.mjs` (`SITE`) + `public/robots.txt` + `src/data/site.ts` |

> ⚠️ **Před spuštěním doplňte skutečný telefon** (`site.phone`, `site.phoneHref`) a ověřte e-mail, ceny a sliby (např. „termín do 48 h“, „120+ bodů“).

## Vývoj

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # výstup do ./dist
npm run preview
```

OG obrázek a PNG ikony se generují z `scripts/og.html` a `scripts/icon.html`:

```bash
npm i --no-save playwright && npx playwright install chromium   # jen poprvé
node scripts/generate-images.mjs
```

## Nasazení

Složka `dist/` je čistě statická, takže funguje na jakémkoli hostingu (Cloudflare Pages, Netlify, Vercel, GitHub Pages, běžný webhosting).
Build příkaz: `npm run build`, výstupní složka: `dist`.

## Struktura

```
src/
  components/   Hero, HeroScene (animovaná ilustrace), Checks, Process, Pricing, Coverage (mapa), Faq, Contact…
  data/         site.ts, regions.ts – veškerý obsah
  layouts/      Base.astro – SEO hlavička, JSON-LD, scroll reveal
  pages/        index, proverka-auta/[slug], proverka-auta/index, brand, 404
  styles/       global.css – design tokeny
docs/BRAND.md   brand manuál (webová verze na /brand/)
```
