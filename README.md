# Proklepto · v1.1.0

Web nezávislého technika pro **prověrku ojetých aut** – Olomoucký kraj a celá Morava.

## Technologie

- **[Astro](https://astro.build)**: statické HTML, téměř žádný JavaScript. Výsledek je rychlý web, který Google snadno indexuje.
- Čisté CSS s design tokeny (`src/styles/global.css`), CSS je vložené přímo do HTML.
- Self-hostované variabilní fonty (Archivo + Inter) s preloadem.
- Animace: jen jemné objevení obsahu při scrollu. Respektuje `prefers-reduced-motion`.
- Rezervace termínu: vestavěný kalendář (`src/components/Booking.astro`), viz níže.

## SEO

- Unikátní `title`, `description`, canonical, Open Graph a Twitter karty na každé stránce.
- Strukturovaná data JSON-LD: `AutomotiveBusiness`, `WebSite`, `FAQPage`, `Service` a `BreadcrumbList`.
- Lokální landing pages `/proverka-auta/<mesto>/` (Olomouc, Prostějov, Přerov, Šumperk, Jeseník, Hranice, Brno, Vyškov, Zlín, Kroměříž, Ostrava) a rozcestník `/proverka-auta/`.
- `sitemap-index.xml` (automaticky), `robots.txt`, web manifest, favicony, OG obrázek.

## Úpravy obsahu

| Co | Kde |
| --- | --- |
| Telefon, e-mail, otevírací doba, služby a ceny, doprava | `src/data/site.ts` |
| Co kontroluji, postup, FAQ | `src/data/site.ts` |
| Rezervace: dny, časy, dovolená, obsazené termíny | `src/data/booking.ts` |
| Města a jejich texty | `src/data/regions.ts` |
| Doména | `astro.config.mjs` (`SITE`) + `src/data/site.ts` |

> ⚠️ **Před spuštěním doplňte skutečný telefon** (`site.phone`, `site.phoneHref`) a ověřte e-mail, ceny a sliby (např. „potvrdím do 2 hodin“, „protokol týž den“).

## Rezervace termínu

Kalendář na webu ukazuje volné dny a časy podle pravidel v `src/data/booking.ts`:

- `workdays`: pracovní dny (Po–So), `slots`: časy začátku (zvlášť pro sobotu).
- `daysAhead`: kolik dní dopředu (30), `minNoticeHours`: minimální předstih (16 h).
- České státní svátky (včetně Velikonoc) se vynechávají automaticky.
- `closed`: dovolená, např. `'2026-12-31'`. `taken`: ručně obsazené termíny, např. `'2026-10-20 10:30'`.

**Jak se rezervace odešle:**
- Když je `endpoint` prázdný, otevře se zákazníkovi e-mail s vyplněnou rezervací (na `site.email`).
- Pro odesílání bez e-mailového klienta stačí vložit URL formulářové služby do `endpoint`, třeba [Formspree](https://formspree.io) nebo [Web3Forms](https://web3forms.com). Rezervace pak chodí rovnou do e-mailu.

**Externí kalendář později:** v `booking.ts` nastavte `provider: 'embed'` a do `embedUrl` vložte odkaz pro vložení (Reservio, Cal.com, Calendly…). Místo vestavěného kalendáře se zobrazí ten externí, se skutečnou obsazeností.

> Vestavěný kalendář nezná skutečnou obsazenost. Je to žádost o termín, proto web výslovně říká, že termín potvrdíte telefonicky.

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

Web potřebuje **Node.js 22.12+** (je nastaveno v `package.json` → `engines` a v `.nvmrc`).

### GitHub Pages
1. V repozitáři otevřete **Settings → Pages**.
2. U **Build and deployment → Source** vyberte **GitHub Actions**. Nevybírejte „Deploy from a branch“, ta větev by se stavěla přes Jekyll a nefungovala by.
3. Každý push do `main` spustí workflow `.github/workflows/deploy.yml`. Ten web sestaví a nasadí na `https://dohnos.github.io/Technikman/`. Cesta `/Technikman` se nastaví automaticky, při vlastní doméně zmizí.

### Vercel
Stačí importovat repozitář. Nastavení je v `vercel.json` (framework Astro, `npm run build`, výstup `dist`).
Pokud projekt už existuje se starým nastavením, ověřte v **Settings → Build and Deployment**, že **Node.js Version** je 22.x nebo novější a že nikde není ručně přepsaný výstupní adresář.

### Vlastní doména
Doménu nastavte v `astro.config.mjs` (`SITE`) a v `src/data/site.ts`. Na GitHub Pages ji workflow převezme automaticky.

## Struktura

```
src/
  components/   Hero, Report (ukázka protokolu), Services, Checks, Process, Booking (kalendář), Coverage (mapa), Faq…
  data/         site.ts, regions.ts, booking.ts – veškerý obsah
  layouts/      Base.astro – SEO hlavička, JSON-LD, scroll reveal
  pages/        index, proverka-auta/[slug], proverka-auta/index, brand, 404
  styles/       global.css – design tokeny
docs/BRAND.md   brand manuál (webová verze na /brand/)
```
