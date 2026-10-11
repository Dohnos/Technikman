# Proklepto – brand manuál v1.2

Webová verze s ukázkami: `/brand/`.

## Myšlenka
**Proklepto** vychází z „proklepnout“: důkladně prověřit, než se rozhodnete. Značka působí jako dobrý technik: přátelsky, přesně a srozumitelně.

## Logo
- **Značka:** písmeno „P“. Bříško tvoří lupa, nožička její rukojeť, fajfka v lupě znamená „v pořádku“.
- **Barvy:** Asfalt (podklad) a Signál (lupa), fajfka bílá. Na tmavém pozadí je podklad bílý a fajfka tmavá.
- **Logotyp:** `proklepto` malými písmeny, Plus Jakarta Sans ExtraBold.
- **Ochranná zóna:** ¼ šířky značky. **Minimum:** 24 px.

## Barvy
| Název | HEX | Použití |
| --- | --- | --- |
| Asfalt | `#16181B` | text, tmavé plochy, logo |
| Papír | `#F3F1EC` | pozadí stránky a 3D scény |
| Bílá | `#FFFFFF` | panely, karty, formuláře |
| Linka | `#E6E2DA` | rámečky |
| Signál | `#E0531F` | akcent: hlavní tlačítko, ikony, logo, mechanikova bunda |
| OK / Pozor | `#1E8A5A` / `#B7791F` | stavy v protokolu, „v pořádku“ |

## Písmo
**Plus Jakarta Sans** (variabilní). Nadpisy 800, prostrkání −3 až −4 %. Text 400–600, základ 17 px.

## Tvary
Vše zaoblené: 12 / 18 / 28 / 40 px. Tlačítka, štítky, časy a dny v kalendáři jsou pilulky nebo kruhy. Bílé sekce jsou zaoblené panely.

## Ikony
Lineární sada 24 × 24 px, tah 1,75 px (`src/components/Icon.astro`). V sekcích v odznaku 48 px, radius 16 px, světle oranžový podklad (`--accent-soft`).

## Pohyb
- **Úvod:** 3D scéna (three.js). Mechanik obchází auto podle scrollu: sken laku, otevření kapoty, kontrola kola, verdikt.
- **Obsah:** postupně vyjíždí při scrollu, s pružným dojezdem na hover.
- Vše respektuje `prefers-reduced-motion`.

## Tón
Krátké věty v první osobě. „Přijedu, zkontroluji, zavolám.“ Neslibujeme nic, co nejde ověřit.
